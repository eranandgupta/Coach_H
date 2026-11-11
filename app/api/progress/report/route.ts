import { NextRequest } from 'next/server';
import { requireActiveSubscription } from '@/lib/middleware';
import { buildReport, fail, json, queryDay, resolveTargetUser } from '@/lib/progress';
import { addDays, daysBetween, isDayKey } from '@/lib/progressCalc';

export const dynamic = 'force-dynamic';

// GET /api/progress/report?userId=&period=day|week|month&date=YYYY-MM-DD
//     /api/progress/report?userId=&from=YYYY-MM-DD&to=YYYY-MM-DD
// week = the 7 days ending on `date`, month = the 30 days ending on `date`.
async function getHandler(request: NextRequest, context: any) {
  try {
    const sp = new URL(request.url).searchParams;
    const target = resolveTargetUser(context.user, sp.get('userId'));
    if ('error' in target) return fail(target.error, target.status);

    let from: string;
    let to: string;
    const qFrom = sp.get('from');
    const qTo = sp.get('to');
    if (isDayKey(qFrom) && isDayKey(qTo)) {
      from = qFrom <= qTo ? qFrom : qTo;
      to = qFrom <= qTo ? qTo : qFrom;
      if (daysBetween(from, to) > 365) from = addDays(to, -365);
    } else {
      to = queryDay(request);
      const period = sp.get('period');
      from = period === 'day' ? to : period === 'month' ? addDays(to, -29) : addDays(to, -6);
    }

    const report = await buildReport(target.userId, from, to);
    return json({ report });
  } catch (error) {
    console.error('Progress report error:', error);
    return fail('Internal server error', 500);
  }
}

export const GET = requireActiveSubscription(getHandler);
