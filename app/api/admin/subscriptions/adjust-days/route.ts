import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoachOrAdmin } from '@/lib/middleware';
import { eliteSessionsExhausted } from '@/lib/planUtils';

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

    // Every plan, Elite 1:1 included, expires when its days run out. Elite plans also end
    // when every session is used, so extending days only revives one with sessions left.
    const shouldExpire = newEndDate < new Date();
    let shouldReactivate = false;
    if (!shouldExpire && subscription.status === 'expired') {
      const used = await prisma.sessionTracking.count({ where: { subscriptionId: subscription.id } });
      shouldReactivate = !eliteSessionsExhausted(subscription.plan.name, subscription.bonusSessions, used);
    }

    // Update the subscription end date
    const updatedSubscription = await prisma.userSubscription.update({
      where: { id: parseInt(subscriptionId) },
      data: {
        endDate: newEndDate,
        // If removing days pushed it into the past, mark as expired; otherwise preserve current status (active/paused)
        // Extending an expired plan back into the future reactivates it.
        ...(shouldExpire ? { status: 'expired' } : shouldReactivate ? { status: 'active', pausedAt: null } : {}),
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

export const PUT = requireCoachOrAdmin(putHandler);
