import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';


export const dynamic = 'force-dynamic';
async function handler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Get the subscription plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: 'Invalid or inactive subscription plan' },
        { status: 400 }
      );
    }

    // Calculate end date based on plan duration
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Find current subscription to transfer sessions
    const previousSub = await prisma.userSubscription.findFirst({
      where: {
        userId: user.userId,
        status: { in: ['active', 'paused'] },
      },
      include: { sessionTrackings: true },
      orderBy: { createdAt: 'desc' },
    });

    // Cancel any existing active/paused subscriptions
    await prisma.userSubscription.updateMany({
      where: {
        userId: user.userId,
        status: { in: ['active', 'paused'] },
      },
      data: {
        status: 'cancelled',
      },
    });

    // Create new subscription
    const subscription = await prisma.userSubscription.create({
      data: {
        userId: user.userId,
        planId: plan.id,
        status: 'active',
        startDate,
        endDate,
      },
      include: {
        plan: true,
      },
    });

    // Transfer completed sessions from previous subscription
    if (previousSub && previousSub.sessionTrackings.length > 0) {
      const { getTotalSessions } = await import('@/lib/planUtils');
      const newTotalSessions = getTotalSessions(plan.name) || 0;
      const sessionsToTransfer = previousSub.sessionTrackings.filter(
        (s) => s.sessionNumber <= newTotalSessions
      );
      if (sessionsToTransfer.length > 0) {
        await prisma.sessionTracking.createMany({
          data: sessionsToTransfer.map((s) => ({
            subscriptionId: subscription.id,
            sessionNumber: s.sessionNumber,
            confirmedByCoachId: s.confirmedByCoachId,
            notes: s.notes,
            completedAt: s.completedAt,
          })),
        });
      }
    }

    return NextResponse.json(
      {
        message: 'Subscription created successfully',
        subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handler);