import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, trainerPermissionError } from '@/lib/middleware';
import { resolveTrainerPermissions } from '@/lib/trainerPermissions';

// Never statically render: Next 13 caches a GET with no dynamic input at build time.
export const dynamic = 'force-dynamic';

async function getHandler(request: NextRequest, context: any) {
  const user = context.user;
  const denied = await trainerPermissionError(user, 'chat');
  if (denied) return denied;

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

    // Clients: the trainers they can message right now — currently assigned, with chat access.
    // Each gets its conversation created here, so the client sees the trainer in their chat list
    // straight away (before, only the trainer could start it, so client messages went to the coach).
    let chatTrainerIds = new Set<number>();
    if (!isCoach && !isTrainer) {
      const assignments = await prisma.trainerClient.findMany({
        where: { clientId: user.userId },
        select: { trainerId: true, trainer: { select: { trainerPermissions: true } } },
      });
      chatTrainerIds = new Set(
        assignments
          .filter((a) => resolveTrainerPermissions(a.trainer.trainerPermissions).chat)
          .map((a) => a.trainerId)
      );
      for (const trainerId of Array.from(chatTrainerIds)) {
        await prisma.conversation.upsert({
          where: { trainerId_clientId: { trainerId, clientId: user.userId } },
          create: { trainerId, clientId: user.userId },
          update: {},
        });
      }
    }

    const allConversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        coach: { select: { id: true, name: true, image: true, lastSeenAt: true } },
        trainer: { select: { id: true, name: true, image: true, lastSeenAt: true } },
        client: { select: { id: true, name: true, image: true, lastSeenAt: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true, senderId: true, isRead: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // A client no longer sees a trainer chat once that trainer is unassigned or loses chat access.
    const conversations = isCoach || isTrainer
      ? allConversations
      : allConversations.filter((c) => c.trainerId === null || chatTrainerIds.has(c.trainerId));

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
          // Client: show the trainer for a trainer chat, otherwise the coach
          participant = conv.trainerId !== null ? conv.trainer : conv.coach;
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
          // Who the other side is, so a client with a coach AND a trainer chat can tell them apart.
          participantRole: isCoach || isTrainer ? 'client' : conv.trainerId !== null ? 'trainer' : 'coach',
        };
      })
    );

    // For clients: return the coach's info if there's no coach conversation yet. Only plans made by
    // the coach count — a trainer-made plan carries the trainer's id as coachId.
    let coachInfo = null;
    const coachRole = { role: { in: ['coach', 'admin'] } };
    if (!isCoach && !isTrainer && !conversations.some((c) => c.coachId !== null)) {
      const workoutPlan = await prisma.workoutPlan.findFirst({
        where: { clientId: user.userId, coach: coachRole },
        orderBy: { createdAt: 'desc' },
        select: { coachId: true, coach: { select: { id: true, name: true, image: true } } },
      });
      if (workoutPlan) {
        coachInfo = workoutPlan.coach;
      } else {
        const dietPlan = await prisma.dietPlan.findFirst({
          where: { clientId: user.userId, coach: coachRole },
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
        select: { id: true, name: true, image: true, lastSeenAt: true },
        orderBy: { createdAt: 'desc' },
      });
      const existingConvClientIds = new Set(conversations.map((c) => c.clientId));
      availableClients = allClients.filter((c) => !existingConvClientIds.has(c.id));
    }

    // For trainers: return assigned clients without conversations
    if (isTrainer) {
      const assignments = await prisma.trainerClient.findMany({
        where: { trainerId: user.userId },
        include: { client: { select: { id: true, name: true, image: true, lastSeenAt: true } } },
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
  const denied = await trainerPermissionError(user, 'chat');
  if (denied) return denied;

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
