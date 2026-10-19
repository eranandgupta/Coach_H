import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { getMaxPauseDays } from '@/lib/planUtils';
import { findCurrentSubscription, pushQueuedAfter } from '@/lib/subscriptionService';

export const dynamic = 'force-dynamic';

// POST: Pause subscription
// PUT: Resume subscription
async function handlePause(request: NextRequest, context: any) {
  try {
    const { user } = context;

    // The plan covering today — never a queued renewal that starts later (the newest row by
    // createdAt is exactly that after an early renewal).
    const subscription = await findCurrentSubscription(prisma, user.userId);

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    const maxPauseDays = getMaxPauseDays(subscription.plan.duration, subscription.plan.name);

    if (maxPauseDays === 0) {
      return NextResponse.json(
        { error: 'Pause is not available for your current plan' },
        { status: 400 }
      );
    }

    // Already used pause
    if (subscription.pauseDaysUsed > 0) {
      return NextResponse.json(
        { error: 'You have already used your pause for this subscription' },
        { status: 400 }
      );
    }

    // Already paused
    if (subscription.status === 'paused' && subscription.pausedAt) {
      return NextResponse.json(
        { error: 'Subscription is already paused' },
        { status: 400 }
      );
    }

    // Pause the subscription (conditional, so a double-submit can't pause twice)
    const { count } = await prisma.userSubscription.updateMany({
      where: { id: subscription.id, status: 'active', pauseDaysUsed: 0 },
      data: {
        status: 'paused',
        pausedAt: new Date(),
      },
    });
    if (!count) {
      return NextResponse.json(
        { error: 'Subscription is already paused' },
        { status: 400 }
      );
    }
    const updated = await prisma.userSubscription.findUnique({
      where: { id: subscription.id },
      include: { plan: true },
    });

    return NextResponse.json({
      message: 'Subscription paused successfully',
      subscription: updated,
      maxPauseDays,
    });
  } catch (error) {
    console.error('Error pausing subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleResume(request: NextRequest, context: any) {
  try {
    const { user } = context;

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: user.userId,
        status: 'paused',
        pausedAt: { not: null },
        startDate: { lte: new Date() },
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription || !subscription.pausedAt) {
      return NextResponse.json(
        { error: 'No paused subscription found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const pausedAt = new Date(subscription.pausedAt);
    const daysPaused = Math.ceil((now.getTime() - pausedAt.getTime()) / (1000 * 60 * 60 * 24));
    const maxPauseDays = getMaxPauseDays(subscription.plan.duration, subscription.plan.name);

    // Cap at max pause days (in case auto-resume didn't trigger)
    const actualPauseDays = Math.min(daysPaused, maxPauseDays);

    // Extend the end date by the number of days paused
    const currentEndDate = new Date(subscription.endDate);
    const newEndDate = new Date(currentEndDate.getTime() + actualPauseDays * 24 * 60 * 60 * 1000);

    // Conditional on the pause we read, so the extension is applied exactly once even if the
    // client double-clicks or the auto-resume in reconcileSubscriptions runs at the same moment.
    const { count } = await prisma.userSubscription.updateMany({
      where: { id: subscription.id, status: 'paused', pausedAt: subscription.pausedAt },
      data: {
        status: 'active',
        pausedAt: null,
        pauseDaysUsed: actualPauseDays,
        endDate: newEndDate,
      },
    });
    if (!count) {
      return NextResponse.json(
        { error: 'No paused subscription found' },
        { status: 404 }
      );
    }

    // A renewal queued at the old end date now overlaps the extended plan — push it back.
    await pushQueuedAfter(prisma, { ...subscription, endDate: newEndDate }, now);

    const updated = await prisma.userSubscription.findUnique({
      where: { id: subscription.id },
      include: { plan: true },
    });

    return NextResponse.json({
      message: `Subscription resumed! Your plan has been extended by ${actualPauseDays} day${actualPauseDays !== 1 ? 's' : ''}.`,
      subscription: updated,
      daysPaused: actualPauseDays,
    });
  } catch (error) {
    console.error('Error resuming subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handlePause);
export const PUT = requireAuth(handleResume);
