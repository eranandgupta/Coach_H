import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, trainerPermissionError } from '@/lib/middleware';

const RETRY_MATCH_SLACK_MS = 30000;

async function getHandler(request: NextRequest, context: any) {
  const user = context.user;
  const denied = await trainerPermissionError(user, 'chat');
  if (denied) return denied;
  const id = parseInt(context.params.id);

  if (isNaN(id)) {
    return Response.json({ error: 'Invalid conversation ID' }, { status: 400 });
  }

  try {
    // Verify user is participant (or coach viewing trainer conversation)
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    const isParticipant = conversation && (
      conversation.coachId === user.userId ||
      conversation.trainerId === user.userId ||
      conversation.clientId === user.userId
    );
    const isCoachViewing = conversation && (user.role === 'coach' || user.role === 'admin') && conversation.trainerId !== null;

    if (!conversation || (!isParticipant && !isCoachViewing)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Fetch the NEWEST `limit` messages (desc), then reverse to ascending for
    // display. Ordering asc + take would return the OLDEST page and hide recent
    // messages once a conversation grows past `limit` — the cursor is only sent
    // when paging further back in history.
    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'desc' },
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
    messages.reverse();

    // Mark unread messages as read only if user is a participant (not coach viewing).
    // This must cover the whole conversation, not just the fetched page — otherwise
    // unread messages beyond `limit` keep the unread badge stuck forever.
    if (isParticipant) {
      await prisma.message.updateMany({
        where: {
          conversationId: id,
          senderId: { not: user.userId },
          isRead: false,
        },
        data: { isRead: true },
      });
    }

    return Response.json({ messages, isReadOnly: isCoachViewing && !isParticipant });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

async function postHandler(request: NextRequest, context: any) {
  const user = context.user;
  const denied = await trainerPermissionError(user, 'chat');
  if (denied) return denied;
  const id = parseInt(context.params.id);

  if (isNaN(id)) {
    return Response.json({ error: 'Invalid conversation ID' }, { status: 400 });
  }

  try {
    // Verify user is a direct participant (coach cannot send in trainer conversations)
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (!conversation || (conversation.coachId !== user.userId && conversation.trainerId !== user.userId && conversation.clientId !== user.userId)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { content, retryAgeMs } = await request.json();

    if (typeof content !== 'string' || !content.trim()) {
      return Response.json({ error: 'Message content required' }, { status: 400 });
    }
    const text = content.trim();
    const select = { id: true, senderId: true, content: true, isRead: true, createdAt: true };

    // A retry may be for a message that WAS saved, with only the reply lost on the way back. If it's
    // already here, return it so it isn't stored twice. retryAgeMs comes from the phone's own timer,
    // so a wrong phone clock can't affect this.
    if (typeof retryAgeMs === 'number' && retryAgeMs >= 0) {
      const existing = await prisma.message.findFirst({
        where: {
          conversationId: id,
          senderId: user.userId,
          content: text,
          createdAt: { gte: new Date(Date.now() - retryAgeMs - RETRY_MATCH_SLACK_MS) },
        },
        orderBy: { createdAt: 'desc' },
        select,
      });
      if (existing) return Response.json({ message: existing });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: user.userId,
        content: text,
      },
      select,
    });

    // The message is saved from here on, so nothing below may report the send as failed.
    try {
      await prisma.conversation.update({
        where: { id },
        data: { updatedAt: new Date() },
      });
    } catch (error) {
      console.error('Error updating conversation timestamp:', error);
    }

    return Response.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export const GET = requireAuth(getHandler);
export const POST = requireAuth(postHandler);
