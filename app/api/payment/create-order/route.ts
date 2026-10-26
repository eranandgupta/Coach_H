import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/middleware';
import { evaluatePromoCode, promoDiscount } from '@/lib/promo';
import { isAutoSaleDiscountActive, MAX_AUTO_SALE_PERCENT } from '@/lib/sale';
import { cashfreeMode, cashfreePhone, createCashfreeOrder } from '@/lib/cashfree';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, planId, planName, name, email, phone, goal, promoCode } = body;

    if (!amount || !planId || !email) {
      return NextResponse.json(
        { error: 'Amount, planId and email are required' },
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
    // otherwise someone edited the request (e.g. to pay ₹1 for a ₹11,999 plan).
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

    // Order tags carry what the webhook needs to activate the plan if the browser never comes
    // back. Cashfree rejects empty tag values and caps each at 255 chars.
    const tags: Record<string, string> = {
      planId: String(plan.id),
      planName: String(planName || plan.name),
      customerName: String(name || ''),
      customerEmail: String(email),
      customerPhone: String(phone || ''),
      goal: String(goal || ''),
      promoCode: promoCodeUsed,
    };
    const orderTags = Object.fromEntries(
      Object.entries(tags).filter(([, v]) => v.trim()).map(([k, v]) => [k, v.slice(0, 255)])
    );

    const orderId = `CH_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const order = await createCashfreeOrder({
      order_id: orderId,
      order_amount: Math.round(requested * 100) / 100,
      order_currency: 'INR',
      customer_details: {
        // Stable per email so Cashfree groups a client's payments together.
        customer_id: `c${crypto.createHash('sha256').update(String(email).toLowerCase()).digest('hex').slice(0, 24)}`,
        customer_name: name && String(name).trim().length >= 3 ? String(name).trim().slice(0, 100) : undefined,
        customer_email: String(email),
        customer_phone: cashfreePhone(phone),
      },
      // Used only when the popup can't open (e.g. Instagram's in-app browser). Cashfree needs https.
      order_meta: request.nextUrl.origin.startsWith('https://')
        ? { return_url: `${request.nextUrl.origin}/payment/return?order_id={order_id}` }
        : undefined,
      order_note: String(planName || plan.name).slice(0, 200).padEnd(3, ' '),
      order_tags: orderTags,
    });

    return NextResponse.json({
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
      amount: order.order_amount,
      currency: order.order_currency,
      mode: cashfreeMode,
    });
  } catch (error: any) {
    console.error('Cashfree create order error:', error?.body || error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
