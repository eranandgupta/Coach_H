import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

async function getHandler(request: NextRequest, context: any) {
  const user = context.user;

  try {
    const isCoach = user.role === 'coach' || user.role === 'admin';
    const isTrainer = user.role === 'trainer';

    let conversationFilter: any;
    if (isCoach) {
      conversationFilter = { coachId: user.userId };
    } else if (isTrainer) {
      conversationFilter = { trainerId: user.userId };
    } else {
      conversationFilter = { clientId: user.userId };
    }

    const unreadCount = await prisma.message.count({
      where: {
        conversation: conversationFilter,
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
