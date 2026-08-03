import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';

async function getHandler(request: NextRequest, context: any) {
  const user = context.user;

  try {
    const isCoach = user.role === 'coach' || user.role === 'admin';
    const isTrainer = user.role === 'trainer';

    let whereClause: any;
    if (isCoach) {
      // Coach sees their own conversations AND all trainer-client conversations
      whereClause = {
        OR: [
          { coachId: user.userId },
          { trainerId: { not: null } },
        ],
      };
    } else if (isTrainer) {
      whereClause = { trainerId: user.userId };
    } else {
      whereClause = { clientId: user.userId };
    }

    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        coach: { select: { id: true, name: true, image: true } },
        trainer: { select: { id: true, name: true, image: true } },
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

        // Determine the other participant
        let participant;
        if (isCoach) {
          participant = conv.client;
        } else if (isTrainer) {
          participant = conv.client;
        } else {
          // Client: show coach or trainer as participant
          participant = conv.coach || conv.trainer;
        }

        // For coach: flag trainer conversations and include trainer info
        const isTrainerConversation = isCoach && conv.trainerId !== null && conv.coachId !== user.userId;

        return {
          id: conv.id,
          participant,
          lastMessage: conv.messages[0] || null,
          unreadCount,
          updatedAt: conv.updatedAt,
          isTrainerConversation,
          trainer: isTrainerConversation ? conv.trainer : undefined,
        };
      })
    );

    // For clients: return coach/trainer info if no conversation exists yet
    let coachInfo = null;
    if (!isCoach && !isTrainer && conversations.length === 0) {
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

    // For coaches: return every client (role 'user') without a conversation yet.
    // Mirrors /api/clients so a coach can message ANY client — including ones who
    // don't have a workout/diet plan created yet (e.g. a brand-new signup).
    let availableClients: { id: number; name: string | null; image: string | null }[] = [];
    if (isCoach) {
      const allClients = await prisma.user.findMany({
        where: { role: 'user' },
        select: { id: true, name: true, image: true },
        orderBy: { createdAt: 'desc' },
      });
      const existingConvClientIds = new Set(conversations.map((c) => c.clientId));
      availableClients = allClients.filter((c) => !existingConvClientIds.has(c.id));
    }

    // For trainers: return assigned clients without conversations
    if (isTrainer) {
      const assignments = await prisma.trainerClient.findMany({
        where: { trainerId: user.userId },
        include: { client: { select: { id: true, name: true, image: true } } },
      });
      const existingConvClientIds = new Set(conversations.map((c) => c.clientId));
      availableClients = assignments
        .filter((a) => !existingConvClientIds.has(a.clientId))
        .map((a) => a.client);
    }

    return Response.json({ conversations: conversationsWithUnread, coachInfo, availableClients });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return Response.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

async function postHandler(request: NextRequest, context: any) {
  const user = context.user;

  try {
    const { coachId, trainerId, clientId } = await request.json();

    if (!clientId || (!coachId && !trainerId)) {
      return Response.json({ error: 'clientId and either coachId or trainerId required' }, { status: 400 });
    }

    // Verify the requesting user is one of the participants
    const participantId = coachId || trainerId;
    if (user.userId !== participantId && user.userId !== clientId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (trainerId) {
      // Trainer-client conversation: verify assignment exists
      const assignment = await prisma.trainerClient.findUnique({
        where: { trainerId_clientId: { trainerId, clientId } },
      });
      if (!assignment) {
        return Response.json({ error: 'Client is not assigned to this trainer' }, { status: 403 });
      }

      const conversation = await prisma.conversation.upsert({
        where: { trainerId_clientId: { trainerId, clientId } },
        create: { trainerId, clientId },
        update: {},
        include: {
          trainer: { select: { id: true, name: true, image: true } },
          client: { select: { id: true, name: true, image: true } },
        },
      });

      return Response.json({ conversation });
    } else {
      // Coach-client conversation: a conversation is always coach(role coach/admin)
      // <-> client(role user). We no longer require an existing workout/diet plan,
      // so a coach can reach a client before any plan is created.
      const [coachUser, clientUser] = await Promise.all([
        prisma.user.findUnique({ where: { id: coachId }, select: { role: true } }),
        prisma.user.findUnique({ where: { id: clientId }, select: { role: true } }),
      ]);
      if (!coachUser || (coachUser.role !== 'coach' && coachUser.role !== 'admin')) {
        return Response.json({ error: 'Invalid coach' }, { status: 403 });
      }
      if (!clientUser || clientUser.role !== 'user') {
        return Response.json({ error: 'Invalid client' }, { status: 403 });
      }

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
    }
  } catch (error) {
    console.error('Error creating conversation:', error);
    return Response.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}

export const GET = requireAuth(getHandler);
export const POST = requireAuth(postHandler);
