import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMembershipExpiryReminder } from '@/lib/email';
import { cronAuthError } from '@/lib/cronAuth';
import { hasRenewalAfter } from '@/lib/subscriptionService';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Run daily by the Vercel cron in vercel.json. Emails every client whose running plan ends on
// the IST calendar day 7 days from today — one reminder per plan, since each day is a fresh
// window. Clients who have already paid for a plan that continues after it are skipped.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Midnight IST of the day containing `d`, plus `days`, as a UTC instant. */
function istDayStart(d: Date, days = 0): Date {
  const ist = new Date(d.getTime() + IST_OFFSET_MS);
  const midnightIstAsUtc = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate());
  return new Date(midnightIstAsUtc - IST_OFFSET_MS + days * DAY_MS);
}

export async function GET(request: NextRequest) {
  const denied = cronAuthError(request);
  if (denied) return denied;

  try {
    const now = new Date();
    const today = istDayStart(now);
    const windowStart = istDayStart(now, 7);
    const windowEnd = istDayStart(now, 8);

    const candidates = await prisma.userSubscription.findMany({
      where: {
        status: { in: ['active', 'paused'] },
        startDate: { lte: now },
        endDate: { gte: windowStart, lt: windowEnd },
      },
      include: {
        user: true,
        plan: true,
      },
    });

    const expiringSubscriptions = [];
    for (const sub of candidates) {
      if (!(await hasRenewalAfter(prisma, sub))) expiringSubscriptions.push(sub);
    }

    console.log(`Found ${expiringSubscriptions.length} subscriptions expiring in 7 days (${candidates.length - expiringSubscriptions.length} already renewed)`);

    let sentCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Send reminder emails
    for (const subscription of expiringSubscriptions) {
      try {
        // Calendar days in IST (always 7 here), not a rounded-up fraction of hours.
        const daysRemaining = Math.round((istDayStart(subscription.endDate).getTime() - today.getTime()) / DAY_MS);

        await sendMembershipExpiryReminder({
          clientName: subscription.user.name || 'Client',
          clientEmail: subscription.user.email,
          planName: subscription.plan.name,
          expiryDate: subscription.endDate,
          daysRemaining: daysRemaining,
        });

        sentCount++;
        console.log(`✓ Sent reminder to ${subscription.user.email}`);
      } catch (error) {
        errorCount++;
        const errorMsg = `Failed to send to ${subscription.user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(`✗ ${errorMsg}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Expiry reminder cron job completed',
      stats: {
        totalFound: expiringSubscriptions.length,
        sent: sentCount,
        errors: errorCount,
      },
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Failed to run expiry reminder cron job',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility with different cron services
export async function POST(request: NextRequest) {
  return GET(request);
}
