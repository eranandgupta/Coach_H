import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Fetch active announcement messages + marquee speed for public display
export async function GET() {
  try {
    const messages = await prisma.announcementMessage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        icon: true,
        text: true,
        sortOrder: true,
      },
    });

    const speedSetting = await prisma.siteSetting.findUnique({
      where: { key: 'marquee_speed' },
    });

    return NextResponse.json({
      messages,
      marqueeSpeed: speedSetting?.value || '30',
    });
  } catch (error) {
    console.error('Fetch active announcements error:', error);
    return NextResponse.json({ messages: [], marqueeSpeed: '30' });
  }
}
