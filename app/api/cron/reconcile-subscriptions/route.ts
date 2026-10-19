import { NextRequest, NextResponse } from 'next/server';
import { cronAuthError } from '@/lib/cronAuth';
import { reconcileSubscriptions } from '@/lib/subscriptionService';

// Daily (vercel.json): settles every client's stored subscription status, including clients who
// never log in — overdue pauses auto-resume, ended plans expire, Elite plans out of sessions
// expire. Access checks already derive status from dates; this keeps the stored rows (admin
// lists, reports, raw queries) honest. Idempotent — safe to re-run.
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const denied = cronAuthError(request);
  if (denied) return denied;

  try {
    const result = await reconcileSubscriptions();
    console.log('Subscription reconcile:', result);
    return NextResponse.json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Subscription reconcile failed:', error);
    return NextResponse.json({ error: 'Reconcile failed' }, { status: 500 });
  }
}
