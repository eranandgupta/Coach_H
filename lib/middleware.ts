import { NextRequest } from 'next/server';
import { verifyToken } from './auth';
import { prisma } from './prisma';

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
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: userId,
        status: 'active',
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

    // Check if subscription has expired
    const now = new Date();
    if (subscription.endDate < now) {
      // Update subscription status to expired
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: { status: 'expired' },
      });

      return {
        isActive: false,
        subscription: subscription,
        message: 'Your subscription has expired. Please renew to continue.',
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

export function requireActiveSubscription(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getAuthUser(request);

    if (!user) {
      return Response.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // Coaches don't need subscriptions
    if (user.role === 'coach') {
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
