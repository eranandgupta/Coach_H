import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';
import { fail, getTargets, json, queryDay, resolveTargetUser, serBody, serCardio, serFood, serWorkout } from '@/lib/progress';
import { dayToDate, weekdayOf } from '@/lib/progressCalc';

export const dynamic = 'force-dynamic';

// GET /api/progress/day?date=YYYY-MM-DD&userId=  -> everything logged on that day, plus the
// targets, the coach's planned exercises for that weekday and the latest body check-in.
async function getHandler(request: NextRequest, context: any) {
  try {
    const target = resolveTargetUser(context.user, new URL(request.url).searchParams.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    const { userId } = target;
    const day = queryDay(request);
    const date = dayToDate(day);

    const [workouts, cardio, food, habit, body, latestBody, targets, plan] = await Promise.all([
      prisma.workoutLog.findMany({ where: { userId, date }, include: { sets: { orderBy: { id: 'asc' } } }, orderBy: { createdAt: 'asc' } }),
      prisma.cardioLog.findMany({ where: { userId, date }, orderBy: { createdAt: 'asc' } }),
      prisma.foodLog.findMany({ where: { userId, date }, orderBy: { createdAt: 'asc' } }),
      prisma.habitEntry.findUnique({ where: { userId_date: { userId, date } }, select: { water: true } }),
      prisma.bodyMetric.findUnique({ where: { userId_date: { userId, date } } }),
      prisma.bodyMetric.findFirst({ where: { userId, date: { lte: date }, weightKg: { not: null } }, orderBy: { date: 'desc' } }),
      getTargets(userId, day),
      prisma.workoutPlan.findFirst({
        where: { clientId: userId, startDate: { lte: date }, endDate: { gte: date } },
        orderBy: { startDate: 'desc' },
        include: { exercises: { where: { day: weekdayOf(day) }, orderBy: { order: 'asc' } } },
      }),
    ]);

    return json({
      date: day,
      workouts: workouts.map(serWorkout),
      cardio: cardio.map(serCardio),
      food: food.map(serFood),
      waterL: habit?.water != null ? Number(habit.water) : null,
      body: serBody(body),
      latestBody: serBody(latestBody),
      targets,
      planned: plan
        ? { title: plan.title, exercises: plan.exercises.map((e) => ({ name: e.name, sets: e.sets, reps: e.reps, exerciseType: e.exerciseType })) }
        : null,
    });
  } catch (error) {
    console.error('Progress day error:', error);
    return fail('Internal server error', 500);
  }
}

export const GET = requireActiveSubscription(getHandler);
