import { NextRequest, NextResponse } from 'next/server';

/**
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set in the project's
 * environment. Returns an error response to send back, or null when the caller is authorised.
 * No fallback secret: without CRON_SECRET configured the endpoint refuses every caller.
 */
export function cronAuthError(request: NextRequest): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('CRON_SECRET is not configured — refusing cron request');
    return NextResponse.json({ error: 'Cron not configured' }, { status: 500 });
  }
  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized - Invalid cron secret' }, { status: 401 });
  }
  return null;
}
