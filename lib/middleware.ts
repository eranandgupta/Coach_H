import { NextRequest } from 'next/server';
import { verifyToken } from './auth';
import { prisma } from './prisma';
import { getMaxPauseDays } from './planUtils';

export interface AuthUser {
  userId: number;
  email: string;
  role: string;
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
}

export async function checkSubscription(userId: number): Promise<{
  isActive: boolean;
  subscription: any | null;
  message?: string;
}> {
  try {
    const now = new Date();

    // Auto-expire any subscriptions that are past their end date but still marked active or paused
    await prisma.userSubscription.updateMany({
      where: {
        userId: userId,
        status: { in: ['active', 'paused'] },
        endDate: { lt: now },
      },
      data: { status: 'expired', pausedAt: null },
    });

    // Find any subscription with endDate in the future (source of truth is the date, not status field)
    // Also include paused subscriptions (they have endDate in future)
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: userId,
        endDate: { gte: now },
      },
      include: {
        plan: true,
      },
      orderBy: {
        endDate: 'desc',
      },
    });

    if (!subscription) {
      return {
        isActive: false,
        subscription: null,
        message: 'No active subscription found. Please subscribe to continue.',
      };
    }

    // If paused, check if max pause days exceeded — auto-resume if so
    if (subscription.status === 'paused' && subscription.pausedAt) {
      const pausedAt = new Date(subscription.pausedAt);
      const daysPaused = Math.ceil((now.getTime() - pausedAt.getTime()) / (1000 * 60 * 60 * 24));
      const maxPause = getMaxPauseDays(subscription.plan.duration, subscription.plan.name);

      if (daysPaused >= maxPause) {
        // Auto-resume: extend endDate by maxPause days, mark active
        const currentEndDate = new Date(subscription.endDate);
        const newEndDate = new Date(currentEndDate.getTime() + maxPause * 24 * 60 * 60 * 1000);
        await prisma.userSubscription.update({
          where: { id: subscription.id },
          data: {
            status: 'active',
            pausedAt: null,
            pauseDaysUsed: maxPause,
            endDate: newEndDate,
          },
        });
        subscription.status = 'active';
        subscription.pausedAt = null;
        subscription.pauseDaysUsed = maxPause;
        subscription.endDate = newEndDate;
      }

      return {
        isActive: true,
        subscription: subscription,
      };
    }

    // Ensure status is synced to 'active' if endDate is still in the future
    if (subscription.status !== 'active') {
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: { status: 'active' },
      });
      subscription.status = 'active';
    }

    return {
      isActive: true,
      subscription: subscription,
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return {
      isActive: false,
      subscription: null,
      message: 'Error checking subscription status.',
    };
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getAuthUser(request);

    if (!user) {
      return Response.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    return handler(request, { ...context, user });
  };
}

export function requireCoach(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getAuthUser(request);

    if (!user) {
      return Response.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    if (user.role !== 'coach') {
      return Response.json(
        { error: 'Forbidden. Coach access required.' },
        { status: 403 }
      );
    }

    return handler(request, { ...context, user });
  };
}

export function requireCoachOrTrainer(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getAuthUser(request);

    if (!user) {
      return Response.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    if (user.role !== 'coach' && user.role !== 'trainer') {
      return Response.json(
        { error: 'Forbidden. Coach or trainer access required.' },
        { status: 403 }
      );
    }

    return handler(request, { ...context, user });
  };
}

export function requireAdmin(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getAuthUser(request);

    if (!user) {
      return Response.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return Response.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    return handler(request, { ...context, user });
  };
}

export function requireActiveSubscription(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getAuthUser(request);

    if (!user) {
      return Response.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // Coaches, admins, and trainers don't need subscriptions
    if (user.role === 'coach' || user.role === 'admin' || user.role === 'trainer') {
      return handler(request, { ...context, user });
    }

    const subscriptionStatus = await checkSubscription(user.userId);

    if (!subscriptionStatus.isActive) {
      return Response.json(
        {
          error: subscriptionStatus.message,
          subscriptionExpired: true,
        },
        { status: 403 }
      );
    }

    return handler(request, { ...context, user, subscription: subscriptionStatus.subscription });
  };
}
