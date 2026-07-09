/**
 * Razorpay Webhook Handler
 *
 * This is the SAFETY NET for payments.
 * If a client pays but their browser closes / network drops before
 * /api/payment/verify is called, this webhook creates the subscription anyway.
 *
 * Events handled:
 *   - payment.captured  → payment confirmed, create subscription if not already done
 *   - payment.failed    → log for debugging
 *
 * Setup: In Razorpay Dashboard → Settings → Webhooks
 *   URL:    https://yourdomain.com/api/payment/webhook
 *   Secret: same as RAZORPAY_WEBHOOK_SECRET in .env
 *   Events: payment.captured, payment.failed
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';
import { hashPassword } from '@/lib/auth';
import { sendCredentialsEmail, sendPaymentReceiptEmail } from '@/lib/email';
import { createOrRenewSubscription } from '@/lib/subscriptionService';

export const dynamic = 'force-dynamic';

// Razorpay sends raw body — do NOT use bodyParser
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') || '';

  // --- 1. Verify webhook signature ---
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  let sigValid = false;
  try {
    sigValid = crypto.timingSafeEqual(
      Buffer.from(expectedSig, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    sigValid = false;
  }

  if (!sigValid) {
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

  const eventType: string = event.event;
  console.log(`Razorpay webhook received: ${eventType}`);

  // --- 3. Handle payment.captured ---
  if (eventType === 'payment.captured') {
    const payment = event.payload?.payment?.entity;
    if (!payment) {
      return NextResponse.json({ error: 'Missing payment entity' }, { status: 400 });
    }

    const paymentId: string = payment.id;
    const orderId: string = payment.order_id;
    const paidAmountPaise: number = Number(payment.amount);
    const customerEmail: string = payment.email || '';

    // --- 4. Idempotency: already processed by /verify? ---
    const existing = await prisma.userSubscription.findFirst({
      where: { razorpayPaymentId: paymentId },
    });
    if (existing) {
      console.log(`Webhook: payment ${paymentId} already processed — skipping`);
      return NextResponse.json({ received: true });
    }

    // --- 5. Get order notes to find planId and customer info ---
    let orderNotes: any = {};
    try {
      const order = await razorpay.orders.fetch(orderId) as any;
      orderNotes = order.notes || {};
    } catch (err) {
      console.error('Webhook: failed to fetch order', orderId, err);
      return NextResponse.json({ error: 'Could not fetch order' }, { status: 502 });
    }

    const planId = orderNotes.planId ? Number(orderNotes.planId) : null;
    const customerName: string = orderNotes.customerName || customerEmail.split('@')[0];
    const emailToUse: string = orderNotes.customerEmail || customerEmail;

    if (!planId || !emailToUse) {
      console.error('Webhook: missing planId or email in order notes', orderNotes);
      return NextResponse.json({ error: 'Insufficient order metadata' }, { status: 400 });
    }

    // --- 6. Get plan ---
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan || !plan.isActive) {
      console.error('Webhook: invalid plan', planId);
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Set from the created subscription (calendar stacking may push the start into the future).
    let startDate = new Date();
    let endDate = new Date();
    const paidAmount = paidAmountPaise / 100;

    let isNewUser = false;
    let plainPassword: string | null = null;

    // --- 7. Atomic: find/create user + subscription ---
    try {
      await prisma.$transaction(async (tx) => {
        let user = await tx.user.findUnique({ where: { email: emailToUse } });

        if (!user) {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          plainPassword = Array.from({ length: 10 }, () =>
            chars.charAt(Math.floor(Math.random() * chars.length))
          ).join('');
          const hashedPass = await hashPassword(plainPassword);
          user = await tx.user.create({
            data: {
              name: customerName,
              email: emailToUse,
              password: hashedPass,
              role: 'user',
            },
          });
          isNewUser = true;
        }

        // Create/renew with the shared policy: calendar stacking (no paid time lost on early
        // renewal) + Elite session rollover. Runs inside this transaction via `tx`.
        const { subscription } = await createOrRenewSubscription(
          {
            userId: user.id,
            plan,
            paymentMode: 'razorpay',
            transactionId: paymentId,
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            paidAmount,
          },
          tx
        );
        startDate = new Date(subscription.startDate);
        endDate = new Date(subscription.endDate);
      });

      console.log(`Webhook: subscription created for payment ${paymentId}, user ${emailToUse}`);
    } catch (txError: any) {
      // Check if duplicate (race condition between /verify and webhook)
      if (txError?.code === 'P2002') {
        console.log(`Webhook: duplicate detected for ${paymentId} — already processed`);
        return NextResponse.json({ received: true });
      }
      throw txError;
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

  // --- payment.failed: just log ---
  if (eventType === 'payment.failed') {
    const payment = event.payload?.payment?.entity;
    console.warn('Payment failed:', {
      id: payment?.id,
      order_id: payment?.order_id,
      email: payment?.email,
      error: payment?.error_description,
    });
  }

  // Always return 200 to Razorpay to acknowledge receipt
  return NextResponse.json({ received: true });
}
