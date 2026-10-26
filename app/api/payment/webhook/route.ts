/**
 * Cashfree Webhook Handler
 *
 * This is the SAFETY NET for payments.
 * If a client pays but their browser closes / network drops before
 * /api/payment/verify is called, this webhook creates the subscription anyway.
 *
 * Events handled:
 *   - PAYMENT_SUCCESS_WEBHOOK  → payment confirmed, create subscription if not already done
 *   - PAYMENT_FAILED_WEBHOOK   → log for debugging
 *
 * Setup: Cashfree Dashboard → Developers → Webhooks → Payment Gateway
 *   URL:    https://coachhimanshu.com/api/payment/webhook
 *   Events: Payment Success, Payment Failed
 *   Signed with CASHFREE_SECRET_KEY (no separate webhook secret).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCashfreeOrder, verifyCashfreeWebhook } from '@/lib/cashfree';
import { hashPassword } from '@/lib/auth';
import { sendCredentialsEmail, sendPaymentReceiptEmail, sendPaymentFulfilmentAlert } from '@/lib/email';
import { createOrRenewSubscription, isDuplicatePaymentError, runPaymentTransaction } from '@/lib/subscriptionService';
import { getSaleBonusDays } from '@/lib/sale';

export const dynamic = 'force-dynamic';

// Signature is computed over the raw body — read it as text, never re-serialise.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-webhook-signature') || '';
  const timestamp = request.headers.get('x-webhook-timestamp') || '';

  // --- 1. Verify webhook signature ---
  if (!process.env.CASHFREE_SECRET_KEY) {
    console.error('CASHFREE_SECRET_KEY not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }
  if (!verifyCashfreeWebhook(rawBody, timestamp, signature)) {
    console.error('Invalid webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // --- 2. Parse event ---
  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType: string = event.type;
  console.log(`Cashfree webhook received: ${eventType}`);

  // --- 3. Handle PAYMENT_SUCCESS_WEBHOOK ---
  if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
    const payment = event.data?.payment;
    const orderId: string = event.data?.order?.order_id;
    if (!payment || !orderId || payment.payment_status !== 'SUCCESS') {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const paymentId = String(payment.cf_payment_id);
    const paidAmount = Number(payment.payment_amount);
    const customerEmail: string = event.data?.customer_details?.customer_email || '';

    // --- 4. Idempotency: already processed by /verify? ---
    const existing = await prisma.userSubscription.findFirst({
      where: { razorpayPaymentId: paymentId },
    });
    if (existing) {
      console.log(`Webhook: payment ${paymentId} already processed — skipping`);
      return NextResponse.json({ received: true });
    }

    // --- 5. Get order tags to find planId and customer info ---
    // Fetched from the API rather than the payload: older webhook versions omit order_tags.
    let orderTags: Record<string, string> = {};
    try {
      const order = await getCashfreeOrder(orderId);
      if (order.order_status !== 'PAID') {
        console.error('Webhook: order not PAID', orderId, order.order_status);
        return NextResponse.json({ error: 'Order not paid' }, { status: 409 });
      }
      orderTags = order.order_tags || {};
    } catch (err: any) {
      console.error('Webhook: failed to fetch order', orderId, err?.body || err);
      return NextResponse.json({ error: 'Could not fetch order' }, { status: 502 });
    }

    const planId = orderTags.planId ? Number(orderTags.planId) : null;
    const emailToUse: string = orderTags.customerEmail || customerEmail;
    const customerName: string = orderTags.customerName || emailToUse.split('@')[0];

    if (!planId || !emailToUse) {
      console.error('Webhook: missing planId or email in order tags', orderTags);
      return NextResponse.json({ error: 'Insufficient order metadata' }, { status: 400 });
    }

    // --- 6. Get plan ---
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    // The customer has ALREADY paid, and create-order rejects inactive plans — so honour the
    // plan even if it was deactivated after checkout. Only a deleted plan is unrecoverable here.
    if (!plan) {
      console.error('Webhook: plan not found', planId);
      await sendPaymentFulfilmentAlert({
        source: 'webhook', paymentId, orderId, customerEmail: emailToUse, customerName,
        planId, amount: paidAmount, error: `Plan ${planId} not found`,
      });
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Set from the created subscription (calendar stacking may push the start into the future).
    let startDate = new Date();
    let endDate = new Date();

    let isNewUser = false;
    let plainPassword: string | null = null;

    // --- 7. Atomic: find/create user + subscription ---
    // bcrypt is slow (~100ms+ on Vercel) — do it BEFORE the transaction so it doesn't eat
    // into the interactive-transaction timeout (a 5s timeout here rolled back paid signups).
    let hashedPass: string | null = null;
    if (!(await prisma.user.findUnique({ where: { email: emailToUse }, select: { id: true } }))) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      plainPassword = Array.from({ length: 10 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
      hashedPass = await hashPassword(plainPassword);
    }

    try {
      await runPaymentTransaction(async (tx) => {
        let user = await tx.user.findUnique({ where: { email: emailToUse } });

        if (!user) {
          if (!hashedPass) throw new Error('User created concurrently — retry');
          user = await tx.user.create({
            data: {
              name: customerName,
              email: emailToUse,
              phone: orderTags.customerPhone || null,
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
            customerGoal: orderTags.goal || null,
          },
          tx
        );
        startDate = new Date(subscription.startDate);
        endDate = new Date(subscription.endDate);
      });

      console.log(`Webhook: subscription created for payment ${paymentId}, user ${emailToUse}`);
    } catch (txError: any) {
      // Check if duplicate (race condition between /verify and webhook)
      if (isDuplicatePaymentError(txError)) {
        console.log(`Webhook: duplicate detected for ${paymentId} — already processed`);
        return NextResponse.json({ received: true });
      }
      console.error('Webhook: fulfilment failed after retries:', txError);
      await sendPaymentFulfilmentAlert({
        source: 'webhook', paymentId, orderId, customerEmail: emailToUse, customerName,
        planId, amount: paidAmount, error: String(txError?.message || txError),
      });
      // 500 makes Cashfree retry the webhook later.
      return NextResponse.json({ error: 'Fulfilment failed' }, { status: 500 });
    }

    // --- 8. Send emails (non-fatal) ---
    if (isNewUser && plainPassword) {
      try {
        await sendCredentialsEmail({
          clientName: customerName,
          clientEmail: emailToUse,
          password: plainPassword,
        });
      } catch (err) {
        console.error('Webhook: credentials email failed:', err);
      }
    }
    try {
      await sendPaymentReceiptEmail({
        clientName: customerName,
        clientEmail: emailToUse,
        paymentId,
        orderId,
        planName: plan.name,
        paidAmount,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    } catch (err) {
      console.error('Webhook: receipt email failed:', err);
    }
  }

  // --- PAYMENT_FAILED_WEBHOOK: just log ---
  if (eventType === 'PAYMENT_FAILED_WEBHOOK') {
    console.warn('Payment failed:', {
      id: event.data?.payment?.cf_payment_id,
      order_id: event.data?.order?.order_id,
      email: event.data?.customer_details?.customer_email,
      error: event.data?.payment?.payment_message,
    });
  }

  // Always return 200 to Cashfree to acknowledge receipt
  return NextResponse.json({ received: true });
}
