import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';
import { hashPassword } from '@/lib/auth';
import { sendCredentialsEmail, sendPaymentReceiptEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      name,
      email,
      whatsapp,
      goal,
      notes,
      partner2Name,
      partner2Email,
      partner2Whatsapp,
      partner2Goal,
    } = body;

    // --- Basic validation ---
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET not configured');
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 });
    }

    // --- 1. Idempotency: prevent duplicate processing ---
    const alreadyProcessed = await prisma.userSubscription.findFirst({
      where: { razorpayPaymentId: razorpay_payment_id },
      include: { plan: true },
    });
    if (alreadyProcessed) {
      console.log(`Payment ${razorpay_payment_id} already processed — returning cached success`);
      return NextResponse.json({
        success: true,
        message: 'Payment already processed. Your subscription is active.',
        receipt: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          planName: alreadyProcessed.plan.name,
          paidAmount: Number(alreadyProcessed.paidAmount ?? alreadyProcessed.plan.price),
          customerName: name || email.split('@')[0],
          customerEmail: email,
          goal: alreadyProcessed.customerGoal,
          startDate: alreadyProcessed.startDate.toISOString(),
          endDate: alreadyProcessed.endDate.toISOString(),
        },
      });
    }

    // --- 2. Verify Razorpay signature (timing-safe) ---
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    let signatureValid = false;
    try {
      signatureValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(razorpay_signature, 'hex')
      );
    } catch {
      signatureValid = false;
    }

    if (!signatureValid) {
      console.error('Signature mismatch for payment', razorpay_payment_id);
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // --- 3. Verify payment with Razorpay API (server-to-server) ---
    let rzpPayment: any;
    try {
      rzpPayment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (err) {
      console.error('Failed to fetch payment from Razorpay:', err);
      return NextResponse.json({ error: 'Could not verify payment with Razorpay' }, { status: 502 });
    }

    if (rzpPayment.status !== 'captured' && rzpPayment.status !== 'authorized') {
      console.error('Payment not captured:', rzpPayment.status, razorpay_payment_id);
      return NextResponse.json({ error: `Payment not completed (status: ${rzpPayment.status})` }, { status: 400 });
    }

    if (rzpPayment.order_id !== razorpay_order_id) {
      console.error('Order ID mismatch', { expected: razorpay_order_id, actual: rzpPayment.order_id });
      return NextResponse.json({ error: 'Payment order mismatch' }, { status: 400 });
    }

    // --- 4. Get plan ---
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: Number(planId) },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive plan' }, { status: 400 });
    }

    // Warn if amount doesn't match (could be promo discount — log but don't block)
    const expectedPaise = Math.round(Number(plan.price) * 100);
    const paidPaise = Number(rzpPayment.amount);
    if (paidPaise > expectedPaise) {
      console.warn('Paid amount exceeds plan price', { paidPaise, expectedPaise, paymentId: razorpay_payment_id });
    }
    const paidAmount = paidPaise / 100;

    // --- 5. Atomic: find/create user + subscription ---
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    let isNewUser = false;
    let plainPassword: string | null = null;

    const result = await prisma.$transaction(async (tx) => {
      // Find or create user
      let user = await tx.user.findUnique({ where: { email } });

      if (!user) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        plainPassword = Array.from({ length: 10 }, () =>
          chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('');
        const hashedPass = await hashPassword(plainPassword);
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

      // Find previous subscription to transfer sessions
      const previousSub = await tx.userSubscription.findFirst({
        where: { userId: user.id, status: { in: ['active', 'paused'] } },
        include: { sessionTrackings: true },
        orderBy: { createdAt: 'desc' },
      });

      // Cancel existing active/paused subscriptions
      await tx.userSubscription.updateMany({
        where: { userId: user.id, status: { in: ['active', 'paused'] } },
        data: { status: 'cancelled', pausedAt: null },
      });

      // Create new subscription
      const subscription = await tx.userSubscription.create({
        data: {
          userId: user.id,
          planId: plan.id,
          status: 'active',
          startDate,
          endDate,
          paymentMode: 'razorpay',
          transactionId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paidAmount,
          customerGoal: goal || null,
          customerNotes: notes || null,
        },
      });

      // Transfer completed sessions from previous subscription
      if (previousSub && previousSub.sessionTrackings.length > 0) {
        const { getTotalSessions } = await import('@/lib/planUtils');
        const newTotalSessions = getTotalSessions(plan.name) || 0;
        const sessionsToTransfer = previousSub.sessionTrackings.filter(
          (s: any) => s.sessionNumber <= newTotalSessions
        );
        if (sessionsToTransfer.length > 0) {
          await tx.sessionTracking.createMany({
            data: sessionsToTransfer.map((s: any) => ({
              subscriptionId: subscription.id,
              sessionNumber: s.sessionNumber,
              confirmedByCoachId: s.confirmedByCoachId,
              notes: s.notes,
              completedAt: s.completedAt,
            })),
          });
        }
      }

      return { user, subscription };
    });

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
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        planName: plan.name,
        paidAmount,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        goal: goal || null,
      });
    } catch (receiptEmailError) {
      console.error('Receipt email failed (non-fatal):', receiptEmailError);
    }

    console.log(`Payment verified & subscription created: ${razorpay_payment_id} → user ${result.user.id}`);

    return NextResponse.json({
      success: true,
      isNewUser,
      message: isNewUser
        ? 'Payment successful! Check your email for login credentials.'
        : 'Payment successful! Your subscription is now active.',
      receipt: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
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
