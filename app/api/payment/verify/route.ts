import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCashfreeOrder, getCashfreeOrderPayments } from '@/lib/cashfree';
import { hashPassword } from '@/lib/auth';
import { sendCredentialsEmail, sendPaymentReceiptEmail, sendPaymentFulfilmentAlert } from '@/lib/email';
import { createOrRenewSubscription, isDuplicatePaymentError, runPaymentTransaction } from '@/lib/subscriptionService';

// Couple plans collect Partner 2's details at checkout. Persist them into the
// subscription notes (previously they were dropped) so the coach receives them; the
// full Partner-2 assessment is captured later on the shared account's assessment form.
function buildNotesWithPartner2(
  notes: string | undefined,
  p2: { partner2Name?: string; partner2Whatsapp?: string; partner2Email?: string; partner2Goal?: string }
): string | null {
  const base = (notes || '').trim();
  if (!p2.partner2Name && !p2.partner2Email && !p2.partner2Whatsapp) {
    return base || null;
  }
  const lines = [
    'Partner 2 (Couple plan):',
    p2.partner2Name ? `  Name: ${p2.partner2Name}` : null,
    p2.partner2Whatsapp ? `  WhatsApp: ${p2.partner2Whatsapp}` : null,
    p2.partner2Email ? `  Email: ${p2.partner2Email}` : null,
    p2.partner2Goal ? `  Goal: ${p2.partner2Goal}` : null,
  ].filter(Boolean);
  return [base, lines.join('\n')].filter(Boolean).join('\n\n');
}
import { getSaleBonusDays } from '@/lib/sale';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, notes, partner2Name, partner2Email, partner2Whatsapp, partner2Goal } = body;

    // --- Basic validation ---
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    // --- 1. Ask Cashfree (server-to-server) what happened to this order ---
    // Nothing from the browser is trusted for money: the paid amount, plan and email all come
    // from the order we created in create-order.
    let cfOrder;
    let cfPayments;
    try {
      [cfOrder, cfPayments] = await Promise.all([getCashfreeOrder(orderId), getCashfreeOrderPayments(orderId)]);
    } catch (err: any) {
      console.error('Failed to fetch order from Cashfree:', orderId, err?.body || err);
      return NextResponse.json({ error: 'Could not verify payment with Cashfree' }, { status: 502 });
    }

    const tags = cfOrder.order_tags || {};
    const planId = Number(tags.planId || body.planId);
    const email: string = tags.customerEmail || cfOrder.customer_details?.customer_email || body.email || '';
    const name: string = body.name || tags.customerName || '';
    const whatsapp: string = body.whatsapp || tags.customerPhone || '';
    const goal: string = body.goal || tags.goal || '';
    if (!planId || !email) {
      console.error('Verify: order has no planId/email', orderId, tags);
      return NextResponse.json({ error: 'Order details missing' }, { status: 400 });
    }

    const successful = cfPayments.find((p) => p.payment_status === 'SUCCESS');
    if (cfOrder.order_status !== 'PAID' || !successful) {
      if (cfPayments.some((p) => p.payment_status === 'PENDING')) {
        // Bank hasn't confirmed yet. The PAYMENT_SUCCESS webhook activates the plan once it does.
        return NextResponse.json(
          { pending: true, error: 'Your payment is still being confirmed by the bank. Your plan will be activated and your login emailed as soon as it completes — no need to pay again.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { notPaid: true, error: 'Payment was not completed. No money has been taken — please try again.' },
        { status: 400 }
      );
    }
    const paymentId = String(successful.cf_payment_id);

    // --- 2. Idempotency: prevent duplicate processing ---
    // The PAYMENT_SUCCESS webhook processes the same payment, often concurrently. Whichever
    // side loses the race returns this cached success instead of creating a second subscription.
    const alreadyProcessedResponse = async () => {
      const existing = await prisma.userSubscription.findFirst({
        where: { razorpayPaymentId: paymentId },
        include: { plan: true },
      });
      if (!existing) return null;
      console.log(`Payment ${paymentId} already processed — returning cached success`);
      return NextResponse.json({
        success: true,
        message: 'Payment already processed. Your subscription is active.',
        receipt: {
          paymentId,
          orderId,
          planName: existing.plan.name,
          paidAmount: Number(existing.paidAmount ?? existing.plan.price),
          customerName: name || email.split('@')[0],
          customerEmail: email,
          goal: existing.customerGoal,
          startDate: existing.startDate.toISOString(),
          endDate: existing.endDate.toISOString(),
        },
      });
    };
    const cached = await alreadyProcessedResponse();
    if (cached) return cached;

    // --- 4. Get plan ---
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: Number(planId) },
    });

    // The Cashfree API confirms the money is received, and create-order only accepts active
    // plans — so honour the plan even if it was deactivated after checkout.
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Warn if amount doesn't match (could be promo discount — log but don't block)
    const paidAmount = Number(successful.payment_amount);
    if (paidAmount > Number(plan.price)) {
      console.warn('Paid amount exceeds plan price', { paidAmount, planPrice: Number(plan.price), paymentId });
    }

    // --- 5. Atomic: find/create user + subscription ---
    let isNewUser = false;
    let plainPassword: string | null = null;

    let result;
    // bcrypt is slow (~100ms+ on Vercel) — do it BEFORE the transaction so it doesn't eat
    // into the interactive-transaction timeout (a 5s timeout here rolled back paid signups).
    let hashedPass: string | null = null;
    if (!(await prisma.user.findUnique({ where: { email: email }, select: { id: true } }))) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      plainPassword = Array.from({ length: 10 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
      hashedPass = await hashPassword(plainPassword);
    }

    try {
      result = await runPaymentTransaction(async (tx) => {
        // Find or create user
        let user = await tx.user.findUnique({ where: { email } });

        if (!user) {
          if (!hashedPass) throw new Error('User created concurrently — retry');
          user = await tx.user.create({
            data: {
              name: name || email.split('@')[0],
              email,
              phone: whatsapp || null,
              password: hashedPass,
              role: 'user',
            },
          });
          isNewUser = true;
        }

        // Create/renew with the shared policy: calendar stacking (no paid time lost on early
        // renewal) + Elite session rollover. Runs inside this transaction via `tx`.
        // Add any July-sale bonus days to the purchased plan length.
        const bonusDays = getSaleBonusDays(plan.name, plan.duration);
        const { subscription } = await createOrRenewSubscription(
          {
            userId: user.id,
            plan,
            duration: plan.duration + bonusDays,
            paymentMode: 'cashfree',
            transactionId: paymentId,
            // Legacy column names — they now hold Cashfree's order/payment IDs.
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            paidAmount,
            customerGoal: goal || null,
            customerNotes: buildNotesWithPartner2(notes, { partner2Name, partner2Whatsapp, partner2Email, partner2Goal }),
          },
          tx
        );

        return { user, subscription };
      });
    } catch (txError: any) {
      if (isDuplicatePaymentError(txError)) {
        const cachedAfterRace = await alreadyProcessedResponse();
        if (cachedAfterRace) return cachedAfterRace;
      }
      // Payment is captured but we couldn't activate it. The webhook will retry; alert the coach too.
      console.error('Payment verify: fulfilment failed after retries:', txError);
      await sendPaymentFulfilmentAlert({
        source: 'verify', paymentId: paymentId, orderId: orderId,
        customerEmail: email, customerName: name, planId: String(planId), amount: paidAmount,
        error: String(txError?.message || txError),
      });
      return NextResponse.json(
        { error: 'Your payment was received, but activation is delayed. You will get your login by email shortly — no need to pay again.' },
        { status: 500 }
      );
    }

    const startDate = new Date(result.subscription.startDate);
    const endDate = new Date(result.subscription.endDate);

    // --- 6. Send emails (outside transaction — non-fatal) ---
    // Send credentials to new users
    if (isNewUser && plainPassword) {
      try {
        await sendCredentialsEmail({
          clientName: name || email.split('@')[0],
          clientEmail: email,
          password: plainPassword,
        });
      } catch (emailError) {
        console.error('Credentials email failed (non-fatal):', emailError);
      }
    }
    // Send payment receipt to all users
    try {
      await sendPaymentReceiptEmail({
        clientName: name || email.split('@')[0],
        clientEmail: email,
        paymentId: paymentId,
        orderId: orderId,
        planName: plan.name,
        paidAmount,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        goal: goal || null,
      });
    } catch (receiptEmailError) {
      console.error('Receipt email failed (non-fatal):', receiptEmailError);
    }

    console.log(`Payment verified & subscription created: ${paymentId} → user ${result.user.id}`);

    return NextResponse.json({
      success: true,
      isNewUser,
      message: isNewUser
        ? 'Payment successful! Check your email for login credentials.'
        : 'Payment successful! Your subscription is now active.',
      receipt: {
        paymentId: paymentId,
        orderId: orderId,
        planName: plan.name,
        paidAmount,
        customerName: name || email.split('@')[0],
        customerEmail: email,
        customerWhatsapp: whatsapp || null,
        goal: goal || null,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
