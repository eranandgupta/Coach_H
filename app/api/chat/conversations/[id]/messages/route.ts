import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

async function getHandler(request: NextRequest, context: any) {
  const user = context.user;
  const id = parseInt(context.params.id);

  if (isNaN(id)) {
    return Response.json({ error: 'Invalid conversation ID' }, { status: 400 });
  }

  try {
    // Verify user is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation || (conversation.coachId !== user.userId && conversation.clientId !== user.userId)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '50');

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
      take: limit,
      ...(cursor ? { cursor: { id: parseInt(cursor) }, skip: 1 } : {}),
      select: {
        id: true,
        senderId: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
    });

    // Mark unread messages from the other party as read
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: user.userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return Response.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

async function postHandler(request: NextRequest, context: any) {
  const user = context.user;
  const id = parseInt(context.params.id);

  if (isNaN(id)) {
    return Response.json({ error: 'Invalid conversation ID' }, { status: 400 });
  }

  try {
    // Verify user is participant
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation || (conversation.coachId !== user.userId && conversation.clientId !== user.userId)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { content } = await request.json();

    if (!content || !content.trim()) {
      return Response.json({ error: 'Message content required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: user.userId,
        content: content.trim(),
      },
      select: {
        id: true,
        senderId: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return Response.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export const GET = requireAuth(getHandler);
export const POST = requireAuth(postHandler);
