import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';
import { fail, int, json, num, ownsRow, resolveTargetUser, serFood, str } from '@/lib/progress';
import { MEAL_KEYS, dayToDate, isDayKey } from '@/lib/progressCalc';

export const dynamic = 'force-dynamic';

function parse(body: any) {
  if (!isDayKey(body.date)) return { error: 'Valid date (YYYY-MM-DD) is required' } as const;
  if (!MEAL_KEYS.includes(body.mealType)) return { error: 'Pick a meal' } as const;
  const foodName = str(body.foodName, 160);
  if (!foodName) return { error: 'Food name is required' } as const;
  return {
    data: {
      date: dayToDate(body.date),
      mealType: body.mealType as string,
      foodName,
      foodSlug: str(body.foodSlug, 120),
      quantity: str(body.quantity, 80),
      calories: int(body.calories, 10000),
      protein: num(body.protein, 1000),
      carbs: num(body.carbs, 2000),
      fats: num(body.fats, 1000),
    },
  } as const;
}

// POST /api/progress/food  { userId?, date, mealType, foodName, quantity?, calories?, protein?, carbs?, fats?, foodSlug? }
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const target = resolveTargetUser(context.user, body.userId);
    if ('error' in target) return fail(target.error, target.status);
    const parsed = parse(body);
    if ('error' in parsed) return fail(parsed.error as string);
    const row = await prisma.foodLog.create({ data: { ...parsed.data, userId: target.userId } });
    return json({ food: serFood(row) });
  } catch (error) {
    console.error('Create food log error:', error);
    return fail('Internal server error', 500);
  }
}

async function putHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const target = resolveTargetUser(context.user, body.userId);
    if ('error' in target) return fail(target.error, target.status);
    const id = int(body.id);
    if (!id || !(await ownsRow('foodLog', id, target.userId))) return fail('Food entry not found', 404);
    const parsed = parse(body);
    if ('error' in parsed) return fail(parsed.error as string);
    const row = await prisma.foodLog.update({ where: { id }, data: parsed.data });
    return json({ food: serFood(row) });
  } catch (error) {
    console.error('Update food log error:', error);
    return fail('Internal server error', 500);
  }
}

async function deleteHandler(request: NextRequest, context: any) {
  try {
    const sp = new URL(request.url).searchParams;
    const target = resolveTargetUser(context.user, sp.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    const id = int(sp.get('id'));
    if (!id || !(await ownsRow('foodLog', id, target.userId))) return fail('Food entry not found', 404);
    await prisma.foodLog.delete({ where: { id } });
    return json({ ok: true });
  } catch (error) {
    console.error('Delete food log error:', error);
    return fail('Internal server error', 500);
  }
}

export const POST = requireActiveSubscription(postHandler);
export const PUT = requireActiveSubscription(putHandler);
export const DELETE = requireActiveSubscription(deleteHandler);
