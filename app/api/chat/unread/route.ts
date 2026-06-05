import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

async function getHandler(request: NextRequest, context: any) {
  const user = context.user;

  try {
    const isCoach = user.role === 'coach' || user.role === 'admin';

    const conversations = await prisma.conversation.findMany({
      where: isCoach ? { coachId: user.userId } : { clientId: user.userId },
      select: { id: true },
    });

    if (conversations.length === 0) {
      return Response.json({ unreadCount: 0 });
    }

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: { in: conversations.map((c) => c.id) },
        senderId: { not: user.userId },
        isRead: false,
      },
    });

    return Response.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return Response.json({ error: 'Failed to fetch unread count' }, { status: 500 });
  }
}

export const GET = requireAuth(getHandler);
