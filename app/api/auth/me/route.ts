import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveTrainerPermissions } from '@/lib/trainerPermissions';
import { checkSubscription } from '@/lib/middleware';
import { verifyToken, generateToken, tokenNeedsRefresh } from '@/lib/auth';
import { readSessionCookie, setSessionCookie, clearSessionCookie } from '@/lib/sessionCookie';


export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    // Prefer the Authorization header; fall back to the httpOnly session cookie so a
    // client whose localStorage was wiped (Safari ITP, cleared storage) stays logged in.
    const header = request.headers.get('authorization');
    const headerToken = header?.startsWith('Bearer ') ? header.substring(7) : null;
    let decoded: any = headerToken ? verifyToken(headerToken) : null;
    let fromCookie = false;
    if (!decoded) {
      const cookieToken = readSessionCookie(request);
      decoded = cookieToken ? verifyToken(cookieToken) : null;
      fromCookie = !!decoded;
    }

    if (!decoded) {
      const res = NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
      clearSessionCookie(res);
      return res;
    }
    const authUser = { userId: decoded.userId, email: decoded.email, role: decoded.role };

    // Get full user data
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        role: true,
        assessmentCompleted: true,
        createdAt: true,
        updatedAt: true,
        trainerPermissions: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check subscription status (only for regular users, not coaches)
    let subscriptionStatus = null;
    if (user.role !== 'coach') {
      subscriptionStatus = await checkSubscription(user.id);
    }

    // Sliding session: hand back a fresh token (and re-arm the cookie) once the current
    // one is a day old, or whenever we had to restore from the cookie.
    const refreshed = fromCookie || tokenNeedsRefresh(decoded)
      ? generateToken(user.id, user.email, user.role)
      : null;

    // Trainers get their resolved access options so the dashboard shows only what they can use.
    const userOut = user.role === 'trainer'
      ? { ...user, trainerPermissions: resolveTrainerPermissions(user.trainerPermissions) }
      : { ...user, trainerPermissions: undefined };

    const res = NextResponse.json(
      {
        user: userOut,
        subscription: subscriptionStatus,
        ...(refreshed ? { token: refreshed } : {}),
      },
      { status: 200 }
    );
    setSessionCookie(res, refreshed || headerToken || readSessionCookie(request)!);
    return res;
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
