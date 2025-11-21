import webpush from 'web-push';
import { prisma } from './prisma';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@coachhimanshu.com';

// Configure web-push
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

/**
 * Send push notification to a specific user
 */
export async function sendPushToUser(
  userId: number,
  payload: PushNotificationPayload
) {
  try {
    // Get all subscriptions for this user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${userId}`);
      return { sent: 0, failed: 0 };
    }

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            JSON.stringify(payload)
          );
          return { success: true };
        } catch (error: any) {
          console.error(`Failed to send push to ${sub.endpoint}:`, error);

          // If subscription is no longer valid, delete it
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { id: sub.id },
            });
          }

          return { success: false, error };
        }
      })
    );

    const sent = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - sent;

    return { sent, failed };
  } catch (error) {
    console.error('Error sending push notifications:', error);
    throw error;
  }
}

/**
 * Send push notification to all users (typically all clients)
 */
export async function sendPushToAll(payload: PushNotificationPayload) {
  try {
    // Get all subscriptions
    const subscriptions = await prisma.pushSubscription.findMany();

    if (subscriptions.length === 0) {
      console.log('No push subscriptions found');
      return { sent: 0, failed: 0 };
    }

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            JSON.stringify(payload)
          );
          return { success: true };
        } catch (error: any) {
          console.error(`Failed to send push to ${sub.endpoint}:`, error);

          // If subscription is no longer valid, delete it
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { id: sub.id },
            });
          }

          return { success: false, error };
        }
      })
    );

    const sent = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - sent;

    return { sent, failed };
  } catch (error) {
    console.error('Error sending push notifications to all:', error);
    throw error;
  }
}

/**
 * Send push notification to all clients (users with role !== 'coach')
 */
export async function sendPushToAllClients(payload: PushNotificationPayload) {
  try {
    // Get all client user IDs
    const clients = await prisma.user.findMany({
      where: {
        role: { not: 'coach' },
      },
      select: { id: true },
    });

    const clientIds = clients.map((c) => c.id);

    // Get subscriptions for all clients
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId: { in: clientIds },
      },
    });

    if (subscriptions.length === 0) {
      console.log('No push subscriptions found for clients');
      return { sent: 0, failed: 0 };
    }

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            JSON.stringify(payload)
          );
          return { success: true };
        } catch (error: any) {
          console.error(`Failed to send push to ${sub.endpoint}:`, error);

          // If subscription is no longer valid, delete it
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { id: sub.id },
            });
          }

          return { success: false, error };
        }
      })
    );

    const sent = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - sent;

    return { sent, failed };
  } catch (error) {
    console.error('Error sending push notifications to clients:', error);
    throw error;
  }
}
