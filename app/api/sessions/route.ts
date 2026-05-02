import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach } from '@/lib/middleware';
import { getTotalSessions } from '@/lib/planUtils';

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

    const totalSessions = getTotalSessions(subscription.plan.name);
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

    return NextResponse.json({ session }, { status: 201 });
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

    await prisma.sessionTracking.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}

export const GET = getHandler;
export const POST = requireCoach(postHandler);
export const DELETE = requireCoach(deleteHandler);
