import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';
import { fail, json, num, resolveTargetUser } from '@/lib/progress';
import { dayToDate, isDayKey } from '@/lib/progressCalc';

export const dynamic = 'force-dynamic';

// POST /api/progress/water  { userId?, date, waterL }
// Water is stored on the habit tracker's HabitEntry so both screens show the same number.
// Only the water column is touched — the day's other habits are left as they are.
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const target = resolveTargetUser(context.user, body.userId);
    if ('error' in target) return fail(target.error, target.status);
    if (!isDayKey(body.date)) return fail('Valid date (YYYY-MM-DD) is required');
    const water = num(body.waterL, 20);
    const date = dayToDate(body.date);
    const entry = await prisma.habitEntry.upsert({
      where: { userId_date: { userId: target.userId, date } },
      update: { water },
      create: { userId: target.userId, date, water },
      select: { water: true },
    });
    return json({ waterL: entry.water != null ? Number(entry.water) : null });
  } catch (error) {
    console.error('Save water error:', error);
    return fail('Internal server error', 500);
  }
}

export const POST = requireActiveSubscription(postHandler);
