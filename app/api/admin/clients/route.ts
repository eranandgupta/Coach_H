import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { hashPassword } from '@/lib/auth';
import { sendCredentialsEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// GET - List all clients (users with role 'user')
async function getHandler(request: NextRequest, context: any) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const whereClause: any = {
      role: 'user',
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const clients = await prisma.user.findMany({
      where: whereClause,
      include: {
        subscriptions: {
          include: {
            plan: true,
          },
          orderBy: {
            startDate: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ clients }, { status: 200 });
  } catch (error) {
    console.error('List clients error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new client user (optionally with subscription + payment info)
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const { name, email, phone, password, planId, paymentMode, transactionId } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: 'user',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If a plan is selected, create a subscription record
    if (planId) {
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: Number(planId) },
      });

      if (plan) {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

        await prisma.userSubscription.create({
          data: {
            userId: user.id,
            planId: plan.id,
            status: 'active',
            startDate,
            endDate,
            transactionId: transactionId || null,
            paymentMode: paymentMode || null,
          },
        });
      }
    }

    // Send credentials email to the new client
    try {
      await sendCredentialsEmail({
        clientName: name,
        clientEmail: email,
        password: password,
      });
    } catch (emailError) {
      console.error('Failed to send credentials email:', emailError);
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getHandler);
export const POST = requireAdmin(postHandler);
