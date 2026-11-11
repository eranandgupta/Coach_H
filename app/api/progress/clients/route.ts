import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { daysBetween, dayToDate } from '@/lib/progressCalc';
import { fail, isStaff, json, lastLogDates, todayKey } from '@/lib/progress';

export const dynamic = 'force-dynamic';

// GET /api/progress/clients  (coach / admin / trainer)
// Every client with a running plan, when they last logged in the diary, and what they have
// logged today — the coach's "who is (not) updating" board. Trainers see only their clients.
async function getHandler(_request: NextRequest, context: any) {
  try {
    const { user } = context;
    if (!isStaff(user.role)) return fail('Forbidden', 403);

    const now = new Date();
    const where: any = {
      role: 'user',
      subscriptions: { some: { status: { in: ['active', 'paused'] }, startDate: { lte: now }, endDate: { gte: now } } },
    };
    if (user.role === 'trainer') {
      const assigned = await prisma.trainerClient.findMany({ where: { trainerId: user.userId }, select: { clientId: true } });
      where.id = { in: assigned.map((a) => a.clientId) };
    }
    const clients = await prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, image: true, createdAt: true,
        subscriptions: {
          where: { status: { in: ['active', 'paused'] }, startDate: { lte: now }, endDate: { gte: now } },
          orderBy: { createdAt: 'desc' }, take: 1,
          select: { status: true, endDate: true, plan: { select: { name: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    const ids = clients.map((c) => c.id);
    const today = todayKey();
    const date = dayToDate(today);
    const where2 = { userId: { in: ids }, date };
    const [last, w, c, f, b, h] = await Promise.all([
      lastLogDates(ids),
      prisma.workoutLog.groupBy({ by: ['userId'], where: where2, _count: { _all: true } }),
      prisma.cardioLog.groupBy({ by: ['userId'], where: where2, _count: { _all: true } }),
      prisma.foodLog.groupBy({ by: ['userId'], where: where2, _count: { _all: true } }),
      prisma.bodyMetric.groupBy({ by: ['userId'], where: where2, _count: { _all: true } }),
      prisma.habitEntry.findMany({ where: { ...where2, water: { not: null } }, select: { userId: true } }),
    ]);
    const has = (rows: { userId: number }[]) => new Set(rows.map((r) => r.userId));
    const [W, C, F, B, H] = [has(w), has(c), has(f), has(b), has(h)];

    return json({
      date: today,
      clients: clients.map((cl) => {
        const lastLog = last.get(cl.id) ?? null;
        return {
          id: cl.id,
          name: cl.name,
          email: user.role === 'trainer' ? null : cl.email,
          image: cl.image,
          plan: cl.subscriptions[0]?.plan.name ?? null,
          status: cl.subscriptions[0]?.status ?? null,
          lastLogDate: lastLog,
          daysSinceLog: lastLog ? daysBetween(lastLog, today) : null,
          today: { workout: W.has(cl.id), cardio: C.has(cl.id), diet: F.has(cl.id), body: B.has(cl.id), water: H.has(cl.id) },
        };
      }),
    });
  } catch (error) {
    console.error('Progress clients error:', error);
    return fail('Internal server error', 500);
  }
}

export const GET = requireAuth(getHandler);
