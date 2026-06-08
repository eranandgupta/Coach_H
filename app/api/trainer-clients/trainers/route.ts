import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

async function getHandler(request: NextRequest, context: any) {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: 'trainer' },
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ trainers }, { status: 200 });
  } catch (error) {
    console.error('Get trainers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireCoach(getHandler);
