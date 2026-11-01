import { NextRequest, NextResponse } from 'next/server';
import { cronAuthError } from '@/lib/cronAuth';
import { reconcileSubscriptions } from '@/lib/subscriptionService';
import { syncPlanPrices } from '@/lib/planPriceSync';

// Daily (vercel.json): settles every client's stored subscription status, including clients who
// never log in — overdue pauses auto-resume, ended plans expire, Elite plans out of sessions
// expire. Access checks already derive status from dates; this keeps the stored rows (admin
// lists, reports, raw queries) honest. Also syncs DB plan prices to lib/pricing.ts.
// Idempotent — safe to re-run.
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const denied = cronAuthError(request);
  if (denied) return denied;

  try {
    const result = await reconcileSubscriptions();
    console.log('Subscription reconcile:', result);
    const priceChanges = await syncPlanPrices().catch((e) => {
      console.error('Plan price sync failed:', e);
      return [];
    });
    if (priceChanges.length) console.log('Plan prices synced:', priceChanges);
    return NextResponse.json({ success: true, ...result, pricesSynced: priceChanges.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Subscription reconcile failed:', error);
    return NextResponse.json({ error: 'Reconcile failed' }, { status: 500 });
  }
}
