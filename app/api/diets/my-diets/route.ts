import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';


export const dynamic = 'force-dynamic';
async function handler(request: NextRequest, context: any) {
  try {
    const { user } = context;

    // Get current date for filtering active diet plans
    const now = new Date();

    const diets = await prisma.dietPlan.findMany({
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
        meals: {
          orderBy: [{ day: 'asc' }, { order: 'asc' }],
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    // Separate current and past diet plans
    const currentDiets = diets.filter((d) => d.endDate >= now);
    const pastDiets = diets.filter((d) => d.endDate < now);

    return NextResponse.json(
      {
        currentDiets,
        pastDiets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get my diets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireActiveSubscription(handler);
