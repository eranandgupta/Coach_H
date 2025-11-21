import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';


export const dynamic = 'force-dynamic';
async function handler(request: NextRequest, context: any) {
  try {
    const { user } = context;

    // Get current date for filtering active workout plans
    const now = new Date();

    const workouts = await prisma.workoutPlan.findMany({
      where: {
        clientId: user.userId,
      },
      include: {
        coach: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        exercises: {
          orderBy: [{ day: 'asc' }, { order: 'asc' }],
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    // Separate current and past workout plans
    const currentWorkouts = workouts.filter((w) => w.endDate >= now);
    const pastWorkouts = workouts.filter((w) => w.endDate < now);

    return NextResponse.json(
      {
        currentWorkouts,
        pastWorkouts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get my workouts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireActiveSubscription(handler);
