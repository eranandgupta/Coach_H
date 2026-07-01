import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// POST - Create, renew, or extend subscription for a client
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const { clientId, planId, duration, transactionId, paymentMode, mode } = body;

    // Validate required fields
    if (!clientId || !planId) {
      return NextResponse.json(
        { error: 'Client ID and Plan ID are required' },
        { status: 400 }
      );
    }

    // Check if client exists
    const client = await prisma.user.findUnique({
      where: { id: parseInt(clientId) },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Check if plan exists
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    let startDate: Date;
    let endDate: Date;

    if (mode === 'extend') {
      // Find the current active subscription
      const activeSub = await prisma.userSubscription.findFirst({
        where: {
          userId: parseInt(clientId),
          OR: [
            { endDate: { gte: new Date() } },
            { status: 'active' },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!activeSub) {
        return NextResponse.json(
          { error: 'No active subscription found to extend' },
          { status: 400 }
        );
      }

      // Extend: start from current endDate, new endDate = current endDate + plan duration
      startDate = activeSub.endDate;
      endDate = new Date(activeSub.endDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);
    } else {
      // Renew or new: start from today
      startDate = new Date();
      endDate = new Date();
      endDate.setDate(endDate.getDate() + (duration || plan.duration));
    }

    // Find the current active subscription before marking as expired (to transfer sessions)
    const previousSub = await prisma.userSubscription.findFirst({
      where: {
        userId: parseInt(clientId),
        status: { in: ['active', 'paused'] },
      },
      include: { sessionTrackings: true },
      orderBy: { createdAt: 'desc' },
    });

    // Mark any existing active/future subscriptions as replaced
    await prisma.userSubscription.updateMany({
      where: {
        userId: parseInt(clientId),
        status: { in: ['active', 'paused'] },
      },
      data: { status: 'expired' },
    });

    // Create subscription
    const subscription = await prisma.userSubscription.create({
      data: {
        userId: parseInt(clientId),
        planId: parseInt(planId),
        status: 'active',
        startDate,
        endDate,
        transactionId: transactionId || null,
        paymentMode: paymentMode || null,
      },
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Transfer completed sessions from previous subscription to new one
    if (previousSub && previousSub.sessionTrackings.length > 0) {
      const { getTotalSessions } = await import('@/lib/planUtils');
      const newTotalSessions = getTotalSessions(plan.name) || 0;
      // Only transfer sessions that fit within the new plan's total
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

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update subscription
async function putHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const { id, status, endDate } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Check if subscription exists
    const existingSubscription = await prisma.userSubscription.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (endDate) updateData.endDate = new Date(endDate);

    // Update subscription
    const updatedSubscription = await prisma.userSubscription.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ subscription: updatedSubscription }, { status: 200 });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete subscription
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Check if subscription exists
    const existingSubscription = await prisma.userSubscription.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Delete subscription
    await prisma.userSubscription.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Subscription deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireCoach(postHandler);
export const PUT = requireCoach(putHandler);
export const DELETE = requireCoach(deleteHandler);
