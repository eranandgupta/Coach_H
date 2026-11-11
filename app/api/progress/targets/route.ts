import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';
import { fail, getTargets, int, isStaff, json, num, resolveTargetUser } from '@/lib/progress';

export const dynamic = 'force-dynamic';

// GET /api/progress/targets?userId=  -> the targets in effect (coach-set or from the diet plan)
async function getHandler(request: NextRequest, context: any) {
  try {
    const target = resolveTargetUser(context.user, new URL(request.url).searchParams.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    return json({ targets: await getTargets(target.userId) });
  } catch (error) {
    console.error('Get targets error:', error);
    return fail('Internal server error', 500);
  }
}

// PUT /api/progress/targets  { userId, calories?, protein?, carbs?, fats?, waterL?, workoutsPerWeek? }
// Coach / admin / trainer only. Blank fields clear that target (falls back to the diet plan).
async function putHandler(request: NextRequest, context: any) {
  try {
    if (!isStaff(context.user.role)) return fail('Only your coach can change targets', 403);
    const body = await request.json();
    const userId = int(body.userId);
    if (!userId) return fail('userId is required');
    const data = {
      calories: int(body.calories, 10000),
      protein: int(body.protein, 1000),
      carbs: int(body.carbs, 2000),
      fats: int(body.fats, 1000),
      waterL: num(body.waterL, 20),
      workoutsPerWeek: int(body.workoutsPerWeek, 14),
      updatedById: context.user.userId,
    };
    await prisma.progressTarget.upsert({ where: { userId }, update: data, create: { ...data, userId } });
    return json({ targets: await getTargets(userId) });
  } catch (error) {
    console.error('Save targets error:', error);
    return fail('Internal server error', 500);
  }
}

export const GET = requireActiveSubscription(getHandler);
export const PUT = requireActiveSubscription(putHandler);
