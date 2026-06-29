import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach } from '@/lib/middleware';
import { isElitePlan, getTotalSessions } from '@/lib/planUtils';

export const dynamic = 'force-dynamic';

// PUT - Adjust days on a specific subscription (add or remove)
async function putHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const { subscriptionId, adjustDays, reason } = body;

    if (!subscriptionId || adjustDays === undefined || adjustDays === 0) {
      return NextResponse.json(
        { error: 'Subscription ID and non-zero adjustment days are required' },
        { status: 400 }
      );
    }

    const days = parseInt(adjustDays);
    if (isNaN(days)) {
      return NextResponse.json(
        { error: 'Invalid adjustment days value' },
        { status: 400 }
      );
    }

    // Find the subscription
    const subscription = await prisma.userSubscription.findUnique({
      where: { id: parseInt(subscriptionId) },
      include: { plan: true, user: { select: { id: true, name: true, email: true } } },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Calculate new end date
    const currentEndDate = new Date(subscription.endDate);
    const newEndDate = new Date(currentEndDate.getTime() + days * 24 * 60 * 60 * 1000);

    // Prevent end date from going before start date
    if (newEndDate <= new Date(subscription.startDate)) {
      return NextResponse.json(
        { error: 'Adjusted end date cannot be before or equal to the start date' },
        { status: 400 }
      );
    }

    // Determine if we should mark as expired when newEndDate is in the past
    let shouldExpire = newEndDate < new Date();
    if (shouldExpire && isElitePlan(subscription.plan.name)) {
      const totalSessions = getTotalSessions(subscription.plan.name);
      if (totalSessions) {
        const usedSessions = await prisma.sessionTracking.count({
          where: { subscriptionId: parseInt(subscriptionId) },
        });
        if (usedSessions < totalSessions) {
          shouldExpire = false; // Elite plan with remaining sessions stays active
        }
      }
    }

    // Update the subscription end date
    const updatedSubscription = await prisma.userSubscription.update({
      where: { id: parseInt(subscriptionId) },
      data: {
        endDate: newEndDate,
        // If removing days pushed it into the past, mark as expired; otherwise preserve current status (active/paused)
        ...(shouldExpire ? { status: 'expired' } : {}),
      },
      include: {
        plan: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      subscription: updatedSubscription,
      adjustment: {
        days,
        previousEndDate: currentEndDate.toISOString(),
        newEndDate: newEndDate.toISOString(),
        reason: reason || null,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Adjust subscription days error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const PUT = requireCoach(putHandler);
