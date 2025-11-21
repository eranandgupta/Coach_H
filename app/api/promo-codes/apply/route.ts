import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST - Apply promo code (increment usage)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      );
    }

    // Find and increment promo code usage
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Invalid promo code' },
        { status: 404 }
      );
    }

    // Increment usage count
    await prisma.promoCode.update({
      where: { id: promoCode.id },
      data: {
        currentUses: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Promo code applied successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('Apply promo code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
