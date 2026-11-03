import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoachOrAdmin } from '@/lib/middleware';
import { previewRenewal } from '@/lib/subscriptionService';

export const dynamic = 'force-dynamic';

// GET - What creating this plan for this client would do. Writes nothing.
async function getHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = parseInt(searchParams.get('clientId') || '');
    const planId = parseInt(searchParams.get('planId') || '');
    const duration = parseInt(searchParams.get('duration') || '');

    if (isNaN(clientId) || isNaN(planId)) {
      return NextResponse.json({ error: 'Client ID and Plan ID are required' }, { status: 400 });
    }

    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const preview = await previewRenewal(prisma, clientId, plan, duration > 0 ? duration : null);
    return NextResponse.json({ preview });
  } catch (error) {
    console.error('Renewal preview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireCoachOrAdmin(getHandler);
