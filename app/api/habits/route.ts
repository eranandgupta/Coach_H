import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// Coach / admin / trainer may view any client's habit data. Clients only ever
// read and write their own (the POST always writes to the logged-in user's id).
const STAFF_ROLES = ['coach', 'admin', 'trainer'];

function monthRange(month?: string | null) {
  let year: number;
  let mon: number; // 0-indexed
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split('-').map(Number);
    year = y;
    mon = m - 1;
  } else {
    const now = new Date();
    year = now.getUTCFullYear();
    mon = now.getUTCMonth();
  }
  return {
    start: new Date(Date.UTC(year, mon, 1)),
    end: new Date(Date.UTC(year, mon + 1, 1)),
  };
}

const toInt = (v: any): number | null => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : null;
};
const toFloat = (v: any): number | null => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : null;
};

// GET /api/habits?userId=<id>&month=YYYY-MM  -> entries for that user & month
async function getHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');
    const month = searchParams.get('month');

    let targetUserId = user.userId;
    if (requestedUserId && Number(requestedUserId) !== user.userId) {
      if (!STAFF_ROLES.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      targetUserId = Number(requestedUserId);
    }

    const { start, end } = monthRange(month);
    const entries = await prisma.habitEntry.findMany({
      where: { userId: targetUserId, date: { gte: start, lt: end } },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Get habits error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/habits  -> upsert the logged-in user's entry for a day
async function postHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const body = await request.json();
    const { date, protein, water, workout, steps, sleep, notes } = body;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Valid date (YYYY-MM-DD) is required' }, { status: 400 });
    }
    const day = new Date(`${date}T00:00:00.000Z`);

    const data = {
      protein: toInt(protein),
      water: toFloat(water),
      workout: Boolean(workout),
      steps: toInt(steps),
      sleep: toFloat(sleep),
      notes: (notes ?? '').toString().trim() || null,
    };

    const entry = await prisma.habitEntry.upsert({
      where: { userId_date: { userId: user.userId, date: day } },
      update: data,
      create: { userId: user.userId, date: day, ...data },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Save habit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireAuth(getHandler);
export const POST = requireAuth(postHandler);
