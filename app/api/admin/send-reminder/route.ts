import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { sendMembershipExpiryReminder } from '@/lib/email';

export const dynamic = 'force-dynamic';

// POST - Send renewal reminder emails
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const { clientId } = body;

    const details: Array<{
      clientId: number;
      clientName: string;
      clientEmail: string;
      daysRemaining: number;
      status: string;
    }> = [];

    if (clientId) {
      // Send reminder to a specific client
      const subscription = await prisma.userSubscription.findFirst({
        where: {
          userId: parseInt(clientId),
          status: { in: ['active', 'paused'] },
        },
        include: {
          plan: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!subscription) {
        return NextResponse.json(
          { error: 'No active subscription found for this client' },
          { status: 404 }
        );
      }

      const now = new Date();
      const daysRemaining = Math.ceil(
        (subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      try {
        await sendMembershipExpiryReminder({
          clientName: subscription.user.name || 'Client',
          clientEmail: subscription.user.email,
          planName: subscription.plan.name,
          expiryDate: subscription.endDate,
          daysRemaining,
        });

        details.push({
          clientId: subscription.user.id,
          clientName: subscription.user.name || 'Client',
          clientEmail: subscription.user.email,
          daysRemaining,
          status: 'sent',
        });
      } catch (emailError) {
        console.error(`Failed to send reminder to ${subscription.user.email}:`, emailError);
        details.push({
          clientId: subscription.user.id,
          clientName: subscription.user.name || 'Client',
          clientEmail: subscription.user.email,
          daysRemaining,
          status: 'failed',
        });
      }
    } else {
      // Send reminders to all active subscriptions expiring within 14 days
      const now = new Date();
      const fourteenDaysFromNow = new Date();
      fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14);

      const expiringSubscriptions = await prisma.userSubscription.findMany({
        where: {
          status: { in: ['active', 'paused'] },
          endDate: {
            gte: now,
            lte: fourteenDaysFromNow,
          },
        },
        include: {
          plan: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      for (const subscription of expiringSubscriptions) {
        const daysRemaining = Math.ceil(
          (subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        try {
          await sendMembershipExpiryReminder({
            clientName: subscription.user.name || 'Client',
            clientEmail: subscription.user.email,
            planName: subscription.plan.name,
            expiryDate: subscription.endDate,
            daysRemaining,
          });

          details.push({
            clientId: subscription.user.id,
            clientName: subscription.user.name || 'Client',
            clientEmail: subscription.user.email,
            daysRemaining,
            status: 'sent',
          });
        } catch (emailError) {
          console.error(`Failed to send reminder to ${subscription.user.email}:`, emailError);
          details.push({
            clientId: subscription.user.id,
            clientName: subscription.user.name || 'Client',
            clientEmail: subscription.user.email,
            daysRemaining,
            status: 'failed',
          });
        }
      }
    }

    const sentCount = details.filter((d) => d.status === 'sent').length;

    return NextResponse.json(
      { success: true, sentCount, details },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send reminder error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(postHandler);
