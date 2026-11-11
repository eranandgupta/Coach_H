import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';
import { fail, int, json, latestBodyWeight, num, ownsRow, resolveTargetUser, serCardio, str } from '@/lib/progress';
import { CARDIO_KEYS, dayToDate, estimateCardioCalories, isDayKey } from '@/lib/progressCalc';

export const dynamic = 'force-dynamic';

async function parse(body: any, userId: number) {
  if (!isDayKey(body.date)) return { error: 'Valid date (YYYY-MM-DD) is required' } as const;
  const activity = CARDIO_KEYS.includes(body.activity) ? body.activity : 'run';
  const distanceKm = num(body.distanceKm, 500);
  const durationSec = int(body.durationSec, 86400);
  const inclinePct = num(body.inclinePct, 40);
  if (!distanceKm && !durationSec) return { error: 'Enter a distance or a time' } as const;
  // Blank calories -> estimate from speed, incline and the client's latest weight.
  let calories = int(body.calories, 10000);
  if (calories == null) {
    calories = estimateCardioCalories({ activity, distanceKm, durationSec, inclinePct, bodyWeightKg: await latestBodyWeight(userId) });
  }
  return {
    data: { date: dayToDate(body.date), activity, distanceKm, durationSec, inclinePct, calories, notes: str(body.notes) },
  } as const;
}

// GET /api/progress/cardio?userId=&limit=  -> recent sessions, newest first
async function getHandler(request: NextRequest, context: any) {
  try {
    const sp = new URL(request.url).searchParams;
    const target = resolveTargetUser(context.user, sp.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    const limit = Math.min(200, Math.max(1, Number(sp.get('limit')) || 30));
    const rows = await prisma.cardioLog.findMany({
      where: { userId: target.userId },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
    return json({ cardio: rows.map(serCardio) });
  } catch (error) {
    console.error('Get cardio logs error:', error);
    return fail('Internal server error', 500);
  }
}

async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const target = resolveTargetUser(context.user, body.userId);
    if ('error' in target) return fail(target.error, target.status);
    const parsed = await parse(body, target.userId);
    if ('error' in parsed) return fail(parsed.error as string);
    const row = await prisma.cardioLog.create({ data: { ...parsed.data, userId: target.userId, loggedById: context.user.userId } });
    return json({ cardio: serCardio(row) });
  } catch (error) {
    console.error('Create cardio log error:', error);
    return fail('Internal server error', 500);
  }
}

async function putHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const target = resolveTargetUser(context.user, body.userId);
    if ('error' in target) return fail(target.error, target.status);
    const id = int(body.id);
    if (!id || !(await ownsRow('cardioLog', id, target.userId))) return fail('Cardio session not found', 404);
    const parsed = await parse(body, target.userId);
    if ('error' in parsed) return fail(parsed.error as string);
    const row = await prisma.cardioLog.update({ where: { id }, data: parsed.data });
    return json({ cardio: serCardio(row) });
  } catch (error) {
    console.error('Update cardio log error:', error);
    return fail('Internal server error', 500);
  }
}

async function deleteHandler(request: NextRequest, context: any) {
  try {
    const sp = new URL(request.url).searchParams;
    const target = resolveTargetUser(context.user, sp.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    const id = int(sp.get('id'));
    if (!id || !(await ownsRow('cardioLog', id, target.userId))) return fail('Cardio session not found', 404);
    await prisma.cardioLog.delete({ where: { id } });
    return json({ ok: true });
  } catch (error) {
    console.error('Delete cardio log error:', error);
    return fail('Internal server error', 500);
  }
}

export const GET = requireActiveSubscription(getHandler);
export const POST = requireActiveSubscription(postHandler);
export const PUT = requireActiveSubscription(putHandler);
export const DELETE = requireActiveSubscription(deleteHandler);
