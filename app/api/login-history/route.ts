import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoachOrTrainer } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// GET /api/login-history?userId=<id>&limit=<n>  -> recent logins for a client.
// Coaches/admins can view any client; trainers only their assigned clients.
async function getHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId'));
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Trainers may only view login history for clients assigned to them.
    if (user.role === 'trainer') {
      const assignment = await prisma.trainerClient.findUnique({
        where: { trainerId_clientId: { trainerId: user.userId, clientId: userId } },
      });
      if (!assignment) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const [events, count, lastLogin] = await Promise.all([
      prisma.loginEvent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: { id: true, createdAt: true, ipAddress: true, userAgent: true },
      }),
      prisma.loginEvent.count({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { lastLoginAt: true } }),
    ]);

    return NextResponse.json({ events, totalCount: count, lastLoginAt: lastLogin?.lastLoginAt ?? null });
  } catch (error) {
    console.error('Get login history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireCoachOrTrainer(getHandler);
