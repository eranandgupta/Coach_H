import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';
import { buildReport, fail, json, lastLogDates, resolveTargetUser, todayKey } from '@/lib/progress';
import { addDays, dayToDate, weekdayOf } from '@/lib/progressCalc';

export const dynamic = 'force-dynamic';

// GET /api/progress/summary?userId=
// The dashboard snapshot: today, this week (7 days), this month (30 days), PRs, the latest
// coach feedback and when the client last logged. Used by the client dashboard card and
// the coach's client card.
async function getHandler(request: NextRequest, context: any) {
  try {
    const target = resolveTargetUser(context.user, new URL(request.url).searchParams.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    const { userId } = target;
    const today = todayKey();
    const date = dayToDate(today);

    const [day, week, month, feedback, last, plan] = await Promise.all([
      buildReport(userId, today, today),
      buildReport(userId, addDays(today, -6), today),
      buildReport(userId, addDays(today, -29), today),
      prisma.progressFeedback.findFirst({ where: { clientId: userId }, orderBy: { createdAt: 'desc' } }),
      lastLogDates([userId]),
      prisma.workoutPlan.findFirst({
        where: { clientId: userId, startDate: { lte: date }, endDate: { gte: date } },
        orderBy: { startDate: 'desc' },
        include: { exercises: { where: { day: weekdayOf(today) }, select: { name: true } } },
      }),
    ]);

    // Today's workout progress: planned exercises for today that have at least one logged set.
    const loggedToday = new Set(day.workout.byExercise.map((e) => e.exercise.toLowerCase().trim()));
    const planned = plan?.exercises.map((e) => e.name) ?? [];
    const plannedDone = planned.filter((n) => loggedToday.has(n.toLowerCase().trim())).length;

    let feedbackOut = null;
    if (feedback) {
      const author = await prisma.user.findUnique({ where: { id: feedback.authorId }, select: { name: true, role: true } });
      feedbackOut = { id: feedback.id, message: feedback.message, createdAt: feedback.createdAt, authorName: author?.name ?? 'Coach', authorRole: author?.role ?? 'coach' };
    }

    const strip = ({ series, prs, ...r }: any) => r;
    return json({
      date: today,
      today: { ...strip(day), planned: planned.length, plannedDone, waterL: day.series[0]?.waterL ?? null },
      week: { ...strip(week), series: week.series },
      month: strip(month),
      prs: month.prs,
      latestWeight: month.body.latestWeight ?? (await prisma.bodyMetric.findFirst({ where: { userId, weightKg: { not: null } }, orderBy: { date: 'desc' }, select: { weightKg: true } }))?.weightKg ?? null,
      lastLogDate: last.get(userId) ?? null,
      feedback: feedbackOut,
    });
  } catch (error) {
    console.error('Progress summary error:', error);
    return fail('Internal server error', 500);
  }
}

export const GET = requireActiveSubscription(getHandler);
