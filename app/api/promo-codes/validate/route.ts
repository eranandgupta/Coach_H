import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST - Validate promo code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, cartTotal, planName } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      );
    }

    if (!cartTotal || cartTotal <= 0) {
      return NextResponse.json(
        { error: 'Invalid cart total' },
        { status: 400 }
      );
    }

    // Find promo code
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Invalid promo code' },
        { status: 404 }
      );
    }

    // Check if promo code is active
    if (!promoCode.isActive) {
      return NextResponse.json(
        { error: 'This promo code is no longer active' },
        { status: 400 }
      );
    }

    // Check if promo code has expired
    if (promoCode.expiryDate && new Date(promoCode.expiryDate) < new Date()) {
      return NextResponse.json(
        { error: 'This promo code has expired' },
        { status: 400 }
      );
    }

    // Check if promo code has reached max uses
    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return NextResponse.json(
        { error: 'This promo code has reached its usage limit' },
        { status: 400 }
      );
    }

    // Check minimum purchase amount
    if (promoCode.minPurchaseAmount && cartTotal < Number(promoCode.minPurchaseAmount)) {
      return NextResponse.json(
        {
          error: `Minimum purchase amount of ₹${promoCode.minPurchaseAmount} required`
        },
        { status: 400 }
      );
    }

    // Check if promo code is applicable to the selected plan
    if (promoCode.applicablePlans && planName) {
      try {
        const applicablePlans = JSON.parse(promoCode.applicablePlans);
        if (Array.isArray(applicablePlans) && applicablePlans.length > 0) {
          const isApplicable = applicablePlans.some(
            (plan: string) => plan.toLowerCase() === planName.toLowerCase()
          );
          if (!isApplicable) {
            return NextResponse.json(
              {
                error: `This promo code is only valid for: ${applicablePlans.join(', ')}`
              },
              { status: 400 }
            );
          }
        }
      } catch (error) {
        console.error('Error parsing applicablePlans:', error);
        // If parsing fails, allow the promo code to be used
      }
    }

    // Calculate discount
    let discountAmount = 0;
    const discountValue = Number(promoCode.discountValue);

    if (promoCode.discountType === 'percentage') {
      discountAmount = (cartTotal * discountValue) / 100;
      // Cap discount at cart total
      discountAmount = Math.min(discountAmount, cartTotal);
    } else if (promoCode.discountType === 'fixed') {
      discountAmount = discountValue;
      // Cap discount at cart total
      discountAmount = Math.min(discountAmount, cartTotal);
    }

    const finalAmount = cartTotal - discountAmount;

    return NextResponse.json({
      success: true,
      promoCode: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: discountValue,
        description: promoCode.description,
      },
      discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimals
      finalAmount: Math.round(finalAmount * 100) / 100,
    }, { status: 200 });

  } catch (error) {
    console.error('Validate promo code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
