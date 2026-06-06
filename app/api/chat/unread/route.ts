import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

async function getHandler(request: NextRequest, context: any) {
  const user = context.user;

  try {
    const isCoach = user.role === 'coach' || user.role === 'admin';

    // Single query: count unread messages across all user's conversations
    const unreadCount = await prisma.message.count({
      where: {
        conversation: isCoach
          ? { coachId: user.userId }
          : { clientId: user.userId },
        senderId: { not: user.userId },
        isRead: false,
      },
    });

    return Response.json({ unreadCount });
  } catch {
    return Response.json({ unreadCount: 0 });
  }
}

export const GET = requireAuth(getHandler);
