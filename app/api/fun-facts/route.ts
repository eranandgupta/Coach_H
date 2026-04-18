import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/middleware';

// Lazy-publish: check if a new fact should go live (4 PM IST daily)
async function lazyPublish() {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);

  const today4pmIST = new Date(istNow);
  today4pmIST.setHours(16, 0, 0, 0);

  // Convert back to UTC for DB comparison
  const today4pmUTC = new Date(today4pmIST.getTime() - istOffset);

  if (now >= today4pmUTC) {
    // Check if we already published a fact after today's 4 PM UTC
    const publishedToday = await prisma.funFact.findFirst({
      where: {
        isPublished: true,
        publishedAt: { gte: today4pmUTC },
      },
    });

    if (!publishedToday) {
      // Activate the next queued fact
      const nextFact = await prisma.funFact.findFirst({
        where: { isPublished: false },
        orderBy: { position: 'asc' },
      });

      if (nextFact) {
        await prisma.funFact.update({
          where: { id: nextFact.id },
          data: { isPublished: true, publishedAt: now },
        });
      }
    }
  }
}

// GET - Fetch active fun fact (+ queue for coach)
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run lazy publish check
    await lazyPublish();

    // Get the currently active fact
    const activeFact = await prisma.funFact.findFirst({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });

    // If coach, also return the queue
    if (authUser.role === 'coach') {
      const queue = await prisma.funFact.findMany({
        where: { isPublished: false },
        orderBy: { position: 'asc' },
      });

      const publishedFacts = await prisma.funFact.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 10,
      });

      return NextResponse.json({
        activeFact,
        queue,
        publishedFacts,
      });
    }

    return NextResponse.json({ activeFact });
  } catch (error) {
    console.error('Error fetching fun facts:', error);
    return NextResponse.json({ error: 'Failed to fetch fun facts' }, { status: 500 });
  }
}

// POST - Add a new fun fact to the queue (coach only)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'coach') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Get max position to add at end of queue
    const maxPos = await prisma.funFact.aggregate({
      _max: { position: true },
    });
    const nextPosition = (maxPos._max.position ?? 0) + 1;

    const fact = await prisma.funFact.create({
      data: {
        content: content.trim(),
        coachId: authUser.userId,
        position: nextPosition,
      },
    });

    return NextResponse.json({ success: true, fact });
  } catch (error) {
    console.error('Error creating fun fact:', error);
    return NextResponse.json({ error: 'Failed to create fun fact' }, { status: 500 });
  }
}

// PUT - Edit a fun fact or reorder queue (coach only)
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'coach') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Reorder mode
    if (body.orderedIds) {
      const { orderedIds } = body as { orderedIds: number[] };
      await Promise.all(
        orderedIds.map((id, index) =>
          prisma.funFact.update({
            where: { id },
            data: { position: index + 1 },
          })
        )
      );
      return NextResponse.json({ success: true });
    }

    // Edit mode
    const { id, content } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const fact = await prisma.funFact.update({
      where: { id },
      data: { content: content.trim() },
    });

    return NextResponse.json({ success: true, fact });
  } catch (error) {
    console.error('Error updating fun fact:', error);
    return NextResponse.json({ error: 'Failed to update fun fact' }, { status: 500 });
  }
}

// DELETE - Remove a queued fun fact (coach only)
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'coach') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.funFact.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting fun fact:', error);
    return NextResponse.json({ error: 'Failed to delete fun fact' }, { status: 500 });
  }
}
