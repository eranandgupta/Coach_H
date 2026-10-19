import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach } from '@/lib/middleware';
import { getEffectiveTotalSessions, subscriptionDisplayStatus } from '@/lib/planUtils';
import { findCurrentSubscription } from '@/lib/subscriptionService';

export const dynamic = 'force-dynamic';

// GET completed sessions for a subscription
async function getHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json({ error: 'subscriptionId is required' }, { status: 400 });
    }

    const sessions = await prisma.sessionTracking.findMany({
      where: { subscriptionId: parseInt(subscriptionId) },
      orderBy: { sessionNumber: 'asc' },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

// POST — coach marks a session as complete
async function postHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const { subscriptionId, sessionNumber, notes } = await request.json();

    if (!subscriptionId || !sessionNumber) {
      return NextResponse.json({ error: 'subscriptionId and sessionNumber are required' }, { status: 400 });
    }

    // Verify subscription exists and get plan name
    const subscription = await prisma.userSubscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Sessions can only be logged against a plan that is running now — not a queued renewal
    // that hasn't started, and not one that has expired or been cancelled.
    const state = subscriptionDisplayStatus(subscription);
    if (state === 'upcoming') {
      return NextResponse.json(
        { error: `This plan starts on ${new Date(subscription.startDate).toDateString()} — sessions can't be logged against it yet` },
        { status: 400 }
      );
    }
    if (state === 'expired' || state === 'cancelled') {
      return NextResponse.json({ error: `This plan is ${state} — sessions can't be logged against it` }, { status: 400 });
    }

    // Include sessions rolled over from a previous plan, or the coach can't confirm them.
    const totalSessions = getEffectiveTotalSessions(subscription.plan.name, subscription.bonusSessions);
    if (totalSessions && sessionNumber > totalSessions) {
      return NextResponse.json({ error: `Session number cannot exceed ${totalSessions}` }, { status: 400 });
    }

    const session = await prisma.sessionTracking.create({
      data: {
        subscriptionId,
        sessionNumber,
        confirmedByCoachId: user.userId,
        notes: notes || null,
      },
    });

    // 1:1 plans end when the last session is done, even if days remain.
    let subscriptionExpired = false;
    if (totalSessions) {
      const completed = await prisma.sessionTracking.count({ where: { subscriptionId } });
      if (completed >= totalSessions) {
        const { count } = await prisma.userSubscription.updateMany({
          where: { id: subscriptionId, status: { in: ['active', 'paused'] } },
          data: { status: 'expired', pausedAt: null },
        });
        subscriptionExpired = count > 0;
      }
    }

    return NextResponse.json({ session, subscriptionExpired }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'This session is already confirmed' }, { status: 409 });
    }
    console.error('Error confirming session:', error);
    return NextResponse.json({ error: 'Failed to confirm session' }, { status: 500 });
  }
}

// DELETE — coach undoes a session confirmation
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const removed = await prisma.sessionTracking.delete({
      where: { id: parseInt(id) },
      include: { subscription: { include: { plan: true } } },
    });

    // Undoing a session on a plan that expired only because its sessions ran out brings it
    // back, as long as its days haven't run out too.
    const sub = removed.subscription;
    const total = getEffectiveTotalSessions(sub.plan.name, sub.bonusSessions);
    // Never revive a plan that a newer one has taken over (e.g. an Elite renewal that rolled
    // its sessions forward) — that would give the client two running plans.
    if (sub.status === 'expired' && total && new Date(sub.endDate) >= new Date() && new Date(sub.startDate) <= new Date()) {
      const completed = await prisma.sessionTracking.count({ where: { subscriptionId: sub.id } });
      // completed + 1 >= total: it was the session count that ended it, not a coach deactivation.
      if (completed < total && completed + 1 >= total) {
        const other = await findCurrentSubscription(prisma, sub.userId);
        if (!other) {
          await prisma.userSubscription.updateMany({ where: { id: sub.id, status: 'expired' }, data: { status: 'active' } });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}

export const GET = getHandler;
export const POST = requireCoach(postHandler);
export const DELETE = requireCoach(deleteHandler);
