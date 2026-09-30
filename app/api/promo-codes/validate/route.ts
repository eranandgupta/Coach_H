import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/middleware';
import { evaluatePromoCode } from '@/lib/promo';

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

    const authUser = await getAuthUser(request);
    const result = await evaluatePromoCode({
      code,
      cartTotal,
      planName,
      userId: authUser?.userId ?? null,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      promoCode: result.promoCode,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
    }, { status: 200 });

  } catch (error) {
    console.error('Validate promo code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
