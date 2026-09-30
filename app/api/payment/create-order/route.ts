import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/middleware';
import { evaluatePromoCode, promoDiscount } from '@/lib/promo';
import { isAutoSaleDiscountActive, MAX_AUTO_SALE_PERCENT } from '@/lib/sale';

export const dynamic = 'force-dynamic';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, planId, planName, name, email, promoCode } = body;

    if (!amount || !planId) {
      return NextResponse.json(
        { error: 'Amount and planId are required' },
        { status: 400 }
      );
    }

    // Block checkout for missing/deactivated plans BEFORE money is taken — once paid, the
    // verify/webhook routes must honour the order, so this is the only place to refuse it.
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: Number(planId) } });
    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: 'This plan is no longer available. Please refresh and choose another plan.' },
        { status: 400 }
      );
    }

    // --- Never trust the browser's amount ---
    // The price comes from the DB. The storefront may knock off a sale % (only inside sale
    // windows) and then a promo code (validated here, server-side). We accept the browser's
    // amount only if it is between the lowest legitimate price and the full DB price;
    // otherwise someone edited the request (e.g. to pay ₹1 for a ₹9,999 plan).
    const requested = Number(amount);
    const fullPrice = Number(plan.price);
    const salePercent = isAutoSaleDiscountActive() ? MAX_AUTO_SALE_PERCENT : 0;
    const salePrice = Math.round(fullPrice * (1 - salePercent / 100));

    let lowestPrice = salePrice;
    let promoCodeUsed = '';
    if (promoCode) {
      const authUser = await getAuthUser(request);
      const promo = await evaluatePromoCode({
        code: String(promoCode),
        cartTotal: fullPrice,
        planName: plan.name,
        userId: authUser?.userId ?? null,
      });
      if (!promo.ok) {
        return NextResponse.json({ error: promo.error }, { status: promo.status });
      }
      lowestPrice = salePrice - promoDiscount(promo.promoCode.discountType, promo.promoCode.discountValue, salePrice);
      promoCodeUsed = promo.promoCode.code;
    }

    // ₹1 tolerance for rounding differences between browser and server.
    if (!Number.isFinite(requested) || requested < Math.max(1, lowestPrice - 1) || requested > fullPrice + 1) {
      console.error('create-order: amount rejected', {
        planId: plan.id, requested, fullPrice, lowestPrice, promoCode: promoCode || null, email,
      });
      return NextResponse.json(
        { error: 'The price has changed. Please refresh the page and try again.' },
        { status: 400 }
      );
    }

    // Razorpay expects amount in paise (₹1 = 100 paise)
    const amountInPaise = Math.round(requested * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      notes: {
        planId: String(planId),
        planName: planName || '',
        customerName: name || '',
        customerEmail: email || '',
        promoCode: promoCodeUsed,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Razorpay create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
