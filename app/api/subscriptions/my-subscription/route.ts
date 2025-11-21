import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, checkSubscription } from '@/lib/middleware';


export const dynamic = 'force-dynamic';
async function handler(request: NextRequest, context: any) {
  try {
    const { user } = context;

    const subscriptionStatus = await checkSubscription(user.userId);

    return NextResponse.json(
      {
        subscription: subscriptionStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
