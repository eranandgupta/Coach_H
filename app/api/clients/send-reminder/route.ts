import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/middleware';
import { sendMembershipExpiryReminder } from '@/lib/email';

// POST - Send subscription expiry reminder to a client
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = authUser.role?.toLowerCase();
    if (userRole !== 'coach') {
      return NextResponse.json({ error: 'Only coaches can send reminders' }, { status: 403 });
    }

    const body = await request.json();
    const { clientId } = body;

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    // Fetch client with active subscription
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: {
        subscriptions: {
          where: {
            status: 'active',
          },
          include: {
            plan: true,
          },
          orderBy: {
            endDate: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (!client.subscriptions || client.subscriptions.length === 0) {
      return NextResponse.json({ error: 'Client has no active subscription' }, { status: 400 });
    }

    const subscription = client.subscriptions[0];
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Send the reminder email
    await sendMembershipExpiryReminder({
      clientName: client.name || 'Client',
      clientEmail: client.email,
      planName: subscription.plan.name,
      expiryDate: endDate,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
    });

    console.log(`Subscription reminder sent to ${client.email} - ${daysRemaining} days remaining`);

    return NextResponse.json({
      success: true,
      message: `Reminder sent to ${client.email}`,
      daysRemaining,
    });
  } catch (error: any) {
    console.error('Error sending reminder:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reminder' },
      { status: 500 }
    );
  }
}
