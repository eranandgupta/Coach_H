import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// GET - List all announcement messages + marquee speed
async function getHandler(request: NextRequest, context: any) {
  try {
    const messages = await prisma.announcementMessage.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    const speedSetting = await prisma.siteSetting.findUnique({
      where: { key: 'marquee_speed' },
    });

    return NextResponse.json({
      messages,
      marqueeSpeed: speedSetting?.value || '30',
    });
  } catch (error) {
    console.error('List announcements error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new announcement message or update marquee speed
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();

    // Update marquee speed
    if (body.marqueeSpeed !== undefined) {
      await prisma.siteSetting.upsert({
        where: { key: 'marquee_speed' },
        update: { value: String(body.marqueeSpeed) },
        create: { key: 'marquee_speed', value: String(body.marqueeSpeed) },
      });
      return NextResponse.json({ success: true });
    }

    // Create announcement message
    const { icon, text } = body;
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const maxOrder = await prisma.announcementMessage.aggregate({
      _max: { sortOrder: true },
    });

    const message = await prisma.announcementMessage.create({
      data: {
        icon: icon || 'sparkles',
        text,
        isActive: true,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update an announcement message
async function putHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const { id, icon, text, isActive, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const data: any = {};
    if (icon !== undefined) data.icon = icon;
    if (text !== undefined) data.text = text;
    if (isActive !== undefined) data.isActive = isActive;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    const message = await prisma.announcementMessage.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Update announcement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete an announcement message
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    await prisma.announcementMessage.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireAdmin(getHandler);
export const POST = requireAdmin(postHandler);
export const PUT = requireAdmin(putHandler);
export const DELETE = requireAdmin(deleteHandler);
