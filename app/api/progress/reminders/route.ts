import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';
import { fail, json, queryDay } from '@/lib/progress';
import { addDays, dayToDate, dateToDay, weekdayOf } from '@/lib/progressCalc';

export const dynamic = 'force-dynamic';

/** True when any Day 30 field of a logbook has a value (the client has done the end-of-cycle check). */
function hasValueIn(data: any, key: 'd1' | 'd30'): boolean {
  if (!data || typeof data !== 'object') return false;
  return ['fitness', 'strength', 'measurements', 'composition'].some((section) =>
    Object.values(data[section] ?? {}).some((v: any) => v && typeof v === 'object' && String(v[key] ?? '').trim() !== '')
  );
}

// GET /api/progress/reminders?date=YYYY-MM-DD
// What the logged-in client still has to log, for the dashboard check-in popup. `date` is the
// client's LOCAL day (members live in many time zones); the popup decides timing from it.
async function getHandler(request: NextRequest, context: any) {
  try {
    const userId = Number(context.user.userId);
    if (!userId) return fail('Unauthorized', 401);
    const day = queryDay(request);
    const date = dayToDate(day);
    const yesterday = dayToDate(addDays(day, -1));
    const twoWeeksAgo = dayToDate(addDays(day, -13));

    const [habits, workoutLogs, cardioCount, foodCount, lastWeighIn, plan, logbook, logbookCount] = await Promise.all([
      prisma.habitEntry.findMany({
        where: { userId, date: { gte: twoWeeksAgo, lte: date } },
        select: { date: true, protein: true, workout: true, steps: true, sleep: true, notes: true },
      }),
      prisma.workoutLog.count({ where: { userId, date } }),
      prisma.cardioLog.count({ where: { userId, date } }),
      prisma.foodLog.count({ where: { userId, date } }),
      prisma.bodyMetric.findFirst({ where: { userId, weightKg: { not: null }, date: { lte: date } }, orderBy: { date: 'desc' }, select: { date: true } }),
      prisma.workoutPlan.findFirst({
        where: { clientId: userId, startDate: { lte: date }, endDate: { gte: date } },
        orderBy: { startDate: 'desc' },
        include: { exercises: { where: { day: weekdayOf(day) }, select: { id: true } } },
      }),
      prisma.transformationLog.findFirst({
        where: { userId },
        orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
        select: { id: true, title: true, startDate: true, endDate: true, data: true },
      }),
      prisma.transformationLog.count({ where: { userId } }),
    ]);

    // A habit row that only holds water came from the diary's water button, not the habit tracker.
    const filled = (h: (typeof habits)[number]) =>
      h.protein != null || h.steps != null || h.sleep != null || h.workout || !!h.notes?.trim();
    const filledDays = new Set(habits.filter(filled).map((h) => dateToDay(h.date)));

    return json({
      date: day,
      habits: {
        today: filledDays.has(day),
        yesterday: filledDays.has(dateToDay(yesterday)),
        daysLast14: filledDays.size,
      },
      workout: { planned: plan?.exercises.length ?? 0, logged: workoutLogs + cardioCount },
      food: { today: foodCount },
      weighIn: { lastDate: lastWeighIn ? dateToDay(lastWeighIn.date) : null },
      logbook: {
        count: logbookCount,
        latest: logbook
          ? {
              id: logbook.id,
              title: logbook.title,
              startDate: logbook.startDate ? dateToDay(logbook.startDate) : null,
              endDate: logbook.endDate ? dateToDay(logbook.endDate) : null,
              hasDay1: hasValueIn(logbook.data, 'd1'),
              hasDay30: hasValueIn(logbook.data, 'd30'),
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Progress reminders error:', error);
    return fail('Internal server error', 500);
  }
}

export const GET = requireActiveSubscription(getHandler);
