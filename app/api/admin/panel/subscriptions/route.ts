import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// GET - List all subscriptions
async function getHandler(request: NextRequest, context: any) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    const subscriptions = await prisma.userSubscription.findMany({
      where: whereClause,
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error) {
    console.error('List subscriptions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Renew or Extend a subscription
// mode: 'extend' = add duration to current active sub's endDate
// mode: 'renew' (default) = create new subscription starting from today
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const { clientId, planId, transactionId, paymentMode, mode } = body;

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

    // Check if plan exists and get duration
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
          endDate: { gte: new Date() },
        },
        orderBy: { endDate: 'desc' },
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
      // Renew: start from today
      startDate = new Date();
      endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);
    }

    // Create new subscription record
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
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getHandler);
export const POST = requireAdmin(postHandler);
