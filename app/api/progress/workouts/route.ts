import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';
import { sendPushToUser } from '@/lib/push';
import { fail, int, json, loadPRs, num, ownsRow, resolveTargetUser, serWorkout, str } from '@/lib/progress';
import { dayToDate, detectNewPRs, exerciseKey, isDayKey, type NewPR } from '@/lib/progressCalc';

export const dynamic = 'force-dynamic';

const MAX_SETS = 200;

function parseSets(input: unknown) {
  if (!Array.isArray(input)) return { error: 'sets must be a list' } as const;
  const perExercise = new Map<string, number>();
  const sets = [];
  for (const raw of input.slice(0, MAX_SETS)) {
    const exercise = str(raw?.exercise, 120);
    const reps = int(raw?.reps, 1000);
    if (!exercise || !reps) continue; // blank rows are ignored, not an error
    const key = exerciseKey(exercise);
    const setNumber = (perExercise.get(key) ?? 0) + 1;
    perExercise.set(key, setNumber);
    sets.push({ exercise, exerciseKey: key, exerciseNote: str(raw?.exerciseNote, 500), setNumber, reps, weightKg: num(raw?.weightKg, 1000) ?? 0 });
  }
  if (!sets.length) return { error: 'Add at least one set with an exercise name and reps' } as const;
  return { sets } as const;
}

async function announcePRs(userId: number, prs: NewPR[]) {
  if (!prs.length) return;
  const first = prs[0];
  const more = prs.length > 1 ? ` (+${prs.length - 1} more)` : '';
  try {
    await sendPushToUser(userId, {
      title: 'New personal record',
      body: `${first.exercise}: ${first.detail}${more}`,
      url: '/dashboard/client?open=progress',
      tag: 'progress-pr',
    });
  } catch (e) {
    console.error('PR push failed:', e);
  }
}

// GET /api/progress/workouts?userId=&limit=  -> recent sessions, newest first
async function getHandler(request: NextRequest, context: any) {
  try {
    const sp = new URL(request.url).searchParams;
    const target = resolveTargetUser(context.user, sp.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    const limit = Math.min(200, Math.max(1, Number(sp.get('limit')) || 30));
    const rows = await prisma.workoutLog.findMany({
      where: { userId: target.userId },
      include: { sets: { orderBy: { id: 'asc' } } },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
    return json({ workouts: rows.map(serWorkout) });
  } catch (error) {
    console.error('Get workout logs error:', error);
    return fail('Internal server error', 500);
  }
}

// POST /api/progress/workouts  { userId?, date, title?, durationMin?, notes?, sets: [{exercise, reps, weightKg, exerciseNote?}] }
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const target = resolveTargetUser(context.user, body.userId);
    if ('error' in target) return fail(target.error, target.status);
    if (!isDayKey(body.date)) return fail('Valid date (YYYY-MM-DD) is required');
    const parsed = parseSets(body.sets);
    if ('error' in parsed) return fail(parsed.error as string);

    const before = await loadPRs(target.userId);
    const log = await prisma.workoutLog.create({
      data: {
        userId: target.userId,
        date: dayToDate(body.date),
        title: str(body.title, 120),
        durationMin: int(body.durationMin, 600),
        notes: str(body.notes),
        loggedById: context.user.userId,
        sets: { create: parsed.sets.map((s) => ({ ...s, userId: target.userId })) },
      },
      include: { sets: { orderBy: { id: 'asc' } } },
    });
    const newPRs = detectNewPRs(before, parsed.sets);
    await announcePRs(target.userId, newPRs);
    return json({ workout: serWorkout(log), newPRs });
  } catch (error) {
    console.error('Create workout log error:', error);
    return fail('Internal server error', 500);
  }
}

// PUT /api/progress/workouts  { id, ...same as POST }  -> replaces the session's sets
async function putHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const target = resolveTargetUser(context.user, body.userId);
    if ('error' in target) return fail(target.error, target.status);
    const id = int(body.id);
    if (!id || !(await ownsRow('workoutLog', id, target.userId))) return fail('Workout not found', 404);
    if (!isDayKey(body.date)) return fail('Valid date (YYYY-MM-DD) is required');
    const parsed = parseSets(body.sets);
    if ('error' in parsed) return fail(parsed.error as string);

    const before = await loadPRs(target.userId, id);
    const log = await prisma.$transaction(async (tx) => {
      await tx.workoutSetLog.deleteMany({ where: { workoutLogId: id } });
      return tx.workoutLog.update({
        where: { id },
        data: {
          date: dayToDate(body.date),
          title: str(body.title, 120),
          durationMin: int(body.durationMin, 600),
          notes: str(body.notes),
          sets: { create: parsed.sets.map((s) => ({ ...s, userId: target.userId })) },
        },
        include: { sets: { orderBy: { id: 'asc' } } },
      });
    });
    const newPRs = detectNewPRs(before, parsed.sets);
    await announcePRs(target.userId, newPRs);
    return json({ workout: serWorkout(log), newPRs });
  } catch (error) {
    console.error('Update workout log error:', error);
    return fail('Internal server error', 500);
  }
}

// DELETE /api/progress/workouts?id=&userId=
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const sp = new URL(request.url).searchParams;
    const target = resolveTargetUser(context.user, sp.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    const id = int(sp.get('id'));
    if (!id || !(await ownsRow('workoutLog', id, target.userId))) return fail('Workout not found', 404);
    await prisma.workoutLog.delete({ where: { id } });
    return json({ ok: true });
  } catch (error) {
    console.error('Delete workout log error:', error);
    return fail('Internal server error', 500);
  }
}

export const GET = requireActiveSubscription(getHandler);
export const POST = requireActiveSubscription(postHandler);
export const PUT = requireActiveSubscription(putHandler);
export const DELETE = requireActiveSubscription(deleteHandler);
