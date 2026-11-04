import { prisma } from './prisma';
import { sendPushToUser } from './push';
import { resolveTrainerPermissions } from './trainerPermissions';

interface ConversationParticipants {
  id: number;
  coachId: number | null;
  trainerId: number | null;
  clientId: number;
}

const BODY_MAX = 160;

/**
 * Push a new chat message to the other participant's devices. Awaited by the send route, because
 * Vercel can freeze the function once the response is sent. Never throws: a failed push must not
 * fail a message that has already been saved.
 */
export async function notifyChatMessage(
  conversation: ConversationParticipants,
  senderId: number,
  content: string
): Promise<void> {
  try {
    const { id, coachId, trainerId, clientId } = conversation;
    const sender = await prisma.user.findUnique({ where: { id: senderId }, select: { name: true } });
    const text = content.length > BODY_MAX ? `${content.slice(0, BODY_MAX - 1)}…` : content;

    const recipients: { userId: number; dashboard: string }[] = [];
    if (clientId !== senderId) recipients.push({ userId: clientId, dashboard: 'client' });
    if (coachId && coachId !== senderId) recipients.push({ userId: coachId, dashboard: 'coach' });
    if (trainerId && trainerId !== senderId) {
      // A trainer without chat access can't open the conversation, so don't alert them about it.
      const trainer = await prisma.user.findUnique({ where: { id: trainerId }, select: { trainerPermissions: true } });
      if (resolveTrainerPermissions(trainer?.trainerPermissions).chat) {
        recipients.push({ userId: trainerId, dashboard: 'trainer' });
      }
    }

    await Promise.allSettled(
      recipients.map(({ userId, dashboard }) =>
        sendPushToUser(
          userId,
          {
            title: sender?.name || 'New message',
            body: text,
            tag: `chat-${id}`,
            renotify: true,
            conversationId: id,
            url: `/dashboard/${dashboard}?chat=${id}`,
          },
          { urgency: 'high', TTL: 24 * 60 * 60, timeout: 4000 }
        )
      )
    );
  } catch (error) {
    console.error('Chat push failed:', error);
  }
}
