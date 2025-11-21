import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMembershipExpiryReminder } from '@/lib/email';

// This endpoint should be called daily by a cron job
// You can use services like:
// 1. Vercel Cron Jobs (if deployed on Vercel)
// 2. cron-job.org (external service)
// 3. GitHub Actions scheduled workflows
// 4. Your own server cron job

export async function GET(request: NextRequest) {
  try {
    // Simple auth check - you should use a secret token in production
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key-here';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid cron secret' },
        { status: 401 }
      );
    }

    // Calculate date range: 7 days from now
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999);

    const eightDaysFromNow = new Date(today);
    eightDaysFromNow.setDate(eightDaysFromNow.getDate() + 8);
    eightDaysFromNow.setHours(0, 0, 0, 0);

    // Find all active subscriptions expiring in exactly 7 days
    const expiringSubscriptions = await prisma.userSubscription.findMany({
      where: {
        status: 'active',
        endDate: {
          gte: sevenDaysFromNow,
          lt: eightDaysFromNow,
        },
      },
      include: {
        user: true,
        plan: true,
      },
    });

    console.log(`Found ${expiringSubscriptions.length} subscriptions expiring in 7 days`);

    let sentCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Send reminder emails
    for (const subscription of expiringSubscriptions) {
      try {
        const daysRemaining = Math.ceil(
          (subscription.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

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
