import { NextRequest } from 'next/server';
import { verifyToken } from './auth';
import { prisma } from './prisma';
import { findCurrentSubscription, reconcileSubscriptions } from './subscriptionService';
import { resolveTrainerPermissions, trainerPermissionLabel, type TrainerPermission } from './trainerPermissions';

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

    // Settle this client's stored statuses first — the same routine the daily cron runs for
    // everyone: overdue pauses auto-resume (endDate extended once), plans past endDate expire
    // (paused plans keep max-pause-days grace), and Elite 1:1 plans with every session used
    // expire even with days left (days OR sessions, whichever first).
    await reconcileSubscriptions(prisma, { userId, now });

    // The plan that actually covers `now`: started, not ended, not cancelled/expired. A queued
    // renewal that starts in the future is never returned (it reads as `upcoming`).
    const subscription = await findCurrentSubscription(prisma, userId, now);

    if (!subscription) {
      return {
        isActive: false,
        subscription: null,
        message: 'No active subscription found. Please subscribe to continue.',
      };
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

export function requireCoachOrAdmin(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getAuthUser(request);

    if (!user) {
      return Response.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    if (user.role !== 'coach' && user.role !== 'admin') {
      return Response.json(
        { error: 'Forbidden. Coach or admin access required.' },
        { status: 403 }
      );
    }

    return handler(request, { ...context, user });
  };
}

/**
 * For a trainer, a 403 response when their account lacks `permission`; null otherwise (and for
 * every non-trainer role). Read from the DB on each call so the coach's changes apply at once.
 */
export async function trainerPermissionError(user: AuthUser, permission: TrainerPermission): Promise<Response | null> {
  if (user.role !== 'trainer') return null;
  const row = await prisma.user.findUnique({ where: { id: user.userId }, select: { trainerPermissions: true } });
  if (resolveTrainerPermissions(row?.trainerPermissions)[permission]) return null;
  return Response.json(
    { error: `Your trainer account doesn't have access to ${trainerPermissionLabel(permission).toLowerCase()}. Ask the coach to turn it on.` },
    { status: 403 }
  );
}

export function requireCoachOrTrainer(handler: Function, permission?: TrainerPermission) {
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

    if (permission) {
      const denied = await trainerPermissionError(user, permission);
      if (denied) return denied;
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
