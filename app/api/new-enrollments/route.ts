import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

async function getHandler(_request: NextRequest) {
  try {
    // Fetch all subscriptions created via Razorpay (online payments), newest first
    const enrollments = await prisma.userSubscription.findMany({
      where: {
        razorpayPaymentId: { not: null },
      },
      include: {
        plan: { select: { id: true, name: true, price: true, duration: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('New enrollments fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireCoach(getHandler);
