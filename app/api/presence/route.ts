import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// POST /api/presence — heartbeat: mark the calling user as seen "now".
// Called every ~60s while the app is open, powering real online / last-seen status.
async function postHandler(_request: NextRequest, context: any) {
  try {
    await prisma.user.update({
      where: { id: context.user.userId },
      data: { lastSeenAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Presence ping error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = requireAuth(postHandler);
