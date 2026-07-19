import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// Coach / admin / trainer may read AND edit any client's logbook (they take Day-30
// measurements in person). Clients only ever touch their own.
const STAFF_ROLES = ['coach', 'admin', 'trainer'];

const parseDate = (v: any) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

// GET /api/transformation-logs?userId=<id>  -> that client's logbooks (newest first)
async function getHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    let targetUserId = user.userId;
    if (requestedUserId && Number(requestedUserId) !== user.userId) {
      if (!STAFF_ROLES.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      targetUserId = Number(requestedUserId);
    }

    const logs = await prisma.transformationLog.findMany({
      where: { userId: targetUserId },
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Get transformation logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/transformation-logs  -> create a new logbook for a client
async function postHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const body = await request.json();
    const { userId, title, startDate, endDate, data } = body;

    let targetUserId = user.userId;
    if (userId && Number(userId) !== user.userId) {
      if (!STAFF_ROLES.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      targetUserId = Number(userId);
    }

    const log = await prisma.transformationLog.create({
      data: {
        userId: targetUserId,
        title: title || null,
        startDate: parseDate(startDate),
        endDate: parseDate(endDate),
        data: data ?? {},
      },
    });

    return NextResponse.json({ message: 'Logbook created', log }, { status: 201 });
  } catch (error) {
    console.error('Create transformation log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/transformation-logs  -> update a logbook (owner client or any staff)
async function putHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const body = await request.json();
    const { id, title, startDate, endDate, data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Logbook ID is required' }, { status: 400 });
    }

    const existing = await prisma.transformationLog.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: 'Logbook not found' }, { status: 404 });
    }
    if (existing.userId !== user.userId && !STAFF_ROLES.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const log = await prisma.transformationLog.update({
      where: { id: Number(id) },
      data: {
        title: title !== undefined ? title || null : existing.title,
        startDate: startDate !== undefined ? parseDate(startDate) : existing.startDate,
        endDate: endDate !== undefined ? parseDate(endDate) : existing.endDate,
        data: data !== undefined ? data : existing.data,
      },
    });

    return NextResponse.json({ message: 'Logbook updated', log });
  } catch (error) {
    console.error('Update transformation log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/transformation-logs?id=<id>  -> delete a logbook (owner client or staff)
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Logbook ID is required' }, { status: 400 });
    }

    const existing = await prisma.transformationLog.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: 'Logbook not found' }, { status: 404 });
    }
    if (existing.userId !== user.userId && !STAFF_ROLES.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.transformationLog.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Logbook deleted' });
  } catch (error) {
    console.error('Delete transformation log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireAuth(getHandler);
export const POST = requireAuth(postHandler);
export const PUT = requireAuth(putHandler);
export const DELETE = requireAuth(deleteHandler);
