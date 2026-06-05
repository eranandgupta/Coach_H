import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

async function getHandler(request: NextRequest, context: any) {
  const user = context.user;

  try {
    const isCoach = user.role === 'coach' || user.role === 'admin';

    const conversations = await prisma.conversation.findMany({
      where: isCoach ? { coachId: user.userId } : { clientId: user.userId },
      include: {
        coach: { select: { id: true, name: true, image: true } },
        client: { select: { id: true, name: true, image: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true, senderId: true, isRead: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Add unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: user.userId },
            isRead: false,
          },
        });

        return {
          id: conv.id,
          participant: isCoach ? conv.client : conv.coach,
          lastMessage: conv.messages[0] || null,
          unreadCount,
          updatedAt: conv.updatedAt,
        };
      })
    );

    // For clients: also return coach info if no conversation exists yet
    let coachInfo = null;
    if (!isCoach && conversations.length === 0) {
      const workoutPlan = await prisma.workoutPlan.findFirst({
        where: { clientId: user.userId },
        orderBy: { createdAt: 'desc' },
        select: { coachId: true, coach: { select: { id: true, name: true, image: true } } },
      });
      if (workoutPlan) {
        coachInfo = workoutPlan.coach;
      } else {
        const dietPlan = await prisma.dietPlan.findFirst({
          where: { clientId: user.userId },
          orderBy: { createdAt: 'desc' },
          select: { coachId: true, coach: { select: { id: true, name: true, image: true } } },
        });
        if (dietPlan) {
          coachInfo = dietPlan.coach;
        }
      }
    }

    return Response.json({ conversations: conversationsWithUnread, coachInfo });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return Response.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

async function postHandler(request: NextRequest, context: any) {
  const user = context.user;

  try {
    const { coachId, clientId } = await request.json();

    if (!coachId || !clientId) {
      return Response.json({ error: 'coachId and clientId required' }, { status: 400 });
    }

    // Verify the requesting user is one of the participants
    if (user.userId !== coachId && user.userId !== clientId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify coach-client relationship exists
    const relationship = await prisma.workoutPlan.findFirst({
      where: { coachId, clientId },
    });
    if (!relationship) {
      const dietRelationship = await prisma.dietPlan.findFirst({
        where: { coachId, clientId },
      });
      if (!dietRelationship) {
        return Response.json({ error: 'No coach-client relationship found' }, { status: 403 });
      }
    }

    // Upsert conversation
    const conversation = await prisma.conversation.upsert({
      where: { coachId_clientId: { coachId, clientId } },
      create: { coachId, clientId },
      update: {},
      include: {
        coach: { select: { id: true, name: true, image: true } },
        client: { select: { id: true, name: true, image: true } },
      },
    });

    return Response.json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return Response.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}

export const GET = requireAuth(getHandler);
export const POST = requireAuth(postHandler);
