import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/middleware';

// GET — fetch active live session link for a plan
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const planName = searchParams.get('planName');

    if (authUser.role === 'coach' || authUser.role === 'trainer') {
      // Coach gets all live session links
      const links = await prisma.liveSessionLink.findMany({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
      });
      return NextResponse.json({ links });
    }

    // Client gets link for their specific plan
    if (!planName) {
      return NextResponse.json({ link: null });
    }

    // For 1:1 plans, fetch client-specific link first, then fall back to plan-wide link
    const isElite = planName.startsWith('Elite 1:1');
    if (isElite) {
      const clientLink = await prisma.liveSessionLink.findFirst({
        where: { planName, clientId: authUser.userId, isActive: true },
        orderBy: { updatedAt: 'desc' },
      });
      if (clientLink) return NextResponse.json({ link: clientLink });
    }

    const link = await prisma.liveSessionLink.findFirst({
      where: { planName, isActive: true, clientId: null },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Error fetching live session link:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST — coach sets/updates a live session link for a plan (optionally per-client)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || (authUser.role !== 'coach' && authUser.role !== 'trainer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { link, title, planName, clientId } = await request.json();

    if (!link?.trim() || !planName?.trim()) {
      return NextResponse.json({ error: 'Link and plan name are required' }, { status: 400 });
    }

    // Deactivate existing link for this plan + client combination
    await prisma.liveSessionLink.updateMany({
      where: {
        planName,
        isActive: true,
        clientId: clientId || null,
      },
      data: { isActive: false },
    });

    // Create new active link
    const sessionLink = await prisma.liveSessionLink.create({
      data: {
        coachId: authUser.userId,
        link: link.trim(),
        title: title?.trim() || null,
        planName: planName.trim(),
        clientId: clientId || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, sessionLink });
  } catch (error) {
    console.error('Error creating live session link:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

// DELETE — coach removes a live session link
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || (authUser.role !== 'coach' && authUser.role !== 'trainer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.liveSessionLink.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting live session link:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
