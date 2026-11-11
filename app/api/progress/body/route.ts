import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';
import { fail, int, json, num, ownsRow, resolveTargetUser, serBody, str } from '@/lib/progress';
import { dayToDate, isDayKey } from '@/lib/progressCalc';

export const dynamic = 'force-dynamic';

const photo = (v: unknown) => {
  const s = str(v, 1000);
  return s && /^https:\/\//.test(s) ? s : null; // ImageKit URLs only; never data: blobs
};

// GET /api/progress/body?userId=  -> every check-in, oldest first (charts + photo compare)
async function getHandler(request: NextRequest, context: any) {
  try {
    const target = resolveTargetUser(context.user, new URL(request.url).searchParams.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    const rows = await prisma.bodyMetric.findMany({ where: { userId: target.userId }, orderBy: { date: 'asc' } });
    return json({ metrics: rows.map(serBody) });
  } catch (error) {
    console.error('Get body metrics error:', error);
    return fail('Internal server error', 500);
  }
}

// POST /api/progress/body  { userId?, date, weightKg?, bodyFatPct?, chestCm?..., photoFront?, photoSide?, photoBack?, notes? }
// One check-in per day: saving the same date again updates it.
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const target = resolveTargetUser(context.user, body.userId);
    if ('error' in target) return fail(target.error, target.status);
    if (!isDayKey(body.date)) return fail('Valid date (YYYY-MM-DD) is required');
    const data = {
      weightKg: num(body.weightKg, 400),
      bodyFatPct: num(body.bodyFatPct, 80),
      chestCm: num(body.chestCm, 300),
      waistCm: num(body.waistCm, 300),
      hipsCm: num(body.hipsCm, 300),
      armsCm: num(body.armsCm, 150),
      thighsCm: num(body.thighsCm, 200),
      neckCm: num(body.neckCm, 100),
      photoFront: photo(body.photoFront),
      photoSide: photo(body.photoSide),
      photoBack: photo(body.photoBack),
      notes: str(body.notes),
    };
    const hasAny = Object.values(data).some((v) => v !== null);
    if (!hasAny) return fail('Enter at least one measurement or photo');
    const date = dayToDate(body.date);
    const row = await prisma.bodyMetric.upsert({
      where: { userId_date: { userId: target.userId, date } },
      update: data,
      create: { ...data, userId: target.userId, date },
    });
    return json({ metric: serBody(row) });
  } catch (error) {
    console.error('Save body metric error:', error);
    return fail('Internal server error', 500);
  }
}

async function deleteHandler(request: NextRequest, context: any) {
  try {
    const sp = new URL(request.url).searchParams;
    const target = resolveTargetUser(context.user, sp.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    const id = int(sp.get('id'));
    if (!id || !(await ownsRow('bodyMetric', id, target.userId))) return fail('Check-in not found', 404);
    await prisma.bodyMetric.delete({ where: { id } });
    return json({ ok: true });
  } catch (error) {
    console.error('Delete body metric error:', error);
    return fail('Internal server error', 500);
  }
}

export const GET = requireActiveSubscription(getHandler);
export const POST = requireActiveSubscription(postHandler);
export const DELETE = requireActiveSubscription(deleteHandler);
