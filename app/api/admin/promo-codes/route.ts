import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// GET - List all promo codes
async function getHandler(request: NextRequest, context: any) {
  try {
    const promoCodes = await prisma.promoCode.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        targetUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ promoCodes }, { status: 200 });
  } catch (error) {
    console.error('List promo codes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new promo code
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const {
      code,
      discountType,
      discountValue,
      maxUses,
      expiryDate,
      description,
      applicablePlans,
      targetUserId,
      broadcast,
    } = body;

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { error: 'Code, discount type, and discount value are required' },
        { status: 400 }
      );
    }

    // Check if promo code already exists
    const existingCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCode) {
      return NextResponse.json(
        { error: 'A promo code with this code already exists' },
        { status: 409 }
      );
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        description: description || null,
        applicablePlans: Array.isArray(applicablePlans)
          ? JSON.stringify(applicablePlans)
          : applicablePlans || null,
        targetUserId: targetUserId ? parseInt(targetUserId) : null,
        // Only advertise on the announcement bar when explicitly requested.
        // Defaults to true when the client doesn't send the flag (back-compat).
        broadcast: broadcast === undefined ? true : Boolean(broadcast),
      },
    });

    return NextResponse.json({ promoCode }, { status: 201 });
  } catch (error) {
    console.error('Create promo code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a promo code
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Promo code ID is required' },
        { status: 400 }
      );
    }

    await prisma.promoCode.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete promo code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getHandler);
export const POST = requireAdmin(postHandler);
export const DELETE = requireAdmin(deleteHandler);
