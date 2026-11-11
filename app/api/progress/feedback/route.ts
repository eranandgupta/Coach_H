import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/middleware';
import { sendPushToUser } from '@/lib/push';
import { fail, int, isStaff, json, resolveTargetUser, str } from '@/lib/progress';

export const dynamic = 'force-dynamic';

// GET /api/progress/feedback?userId=  -> the coach's notes for a client, newest first
async function getHandler(request: NextRequest, context: any) {
  try {
    const target = resolveTargetUser(context.user, new URL(request.url).searchParams.get('userId'));
    if ('error' in target) return fail(target.error, target.status);
    const rows = await prisma.progressFeedback.findMany({ where: { clientId: target.userId }, orderBy: { createdAt: 'desc' }, take: 100 });
    const authors = await prisma.user.findMany({ where: { id: { in: Array.from(new Set(rows.map((r) => r.authorId))) } }, select: { id: true, name: true, role: true } });
    const byId = new Map(authors.map((a) => [a.id, a]));
    return json({
      feedback: rows.map((r) => ({ id: r.id, message: r.message, createdAt: r.createdAt, authorId: r.authorId, authorName: byId.get(r.authorId)?.name ?? 'Coach', authorRole: byId.get(r.authorId)?.role ?? 'coach' })),
    });
  } catch (error) {
    console.error('Get progress feedback error:', error);
    return fail('Internal server error', 500);
  }
}

// POST /api/progress/feedback  { userId, message }  — staff only; the client gets a push.
async function postHandler(request: NextRequest, context: any) {
  try {
    if (!isStaff(context.user.role)) return fail('Only your coach can leave feedback', 403);
    const body = await request.json();
    const clientId = int(body.userId);
    const message = str(body.message, 4000);
    if (!clientId) return fail('userId is required');
    if (!message) return fail('Write a message first');
    const client = await prisma.user.findUnique({ where: { id: clientId }, select: { id: true } });
    if (!client) return fail('Client not found', 404);
    const row = await prisma.progressFeedback.create({ data: { clientId, authorId: context.user.userId, message } });
    try {
      await sendPushToUser(clientId, {
        title: 'New feedback on your progress',
        body: message.length > 120 ? `${message.slice(0, 117)}...` : message,
        url: '/dashboard/client?open=progress',
        tag: 'progress-feedback',
      });
    } catch (e) {
      console.error('Feedback push failed:', e);
    }
    return json({ feedback: { id: row.id, message: row.message, createdAt: row.createdAt, authorId: row.authorId } });
  } catch (error) {
    console.error('Save progress feedback error:', error);
    return fail('Internal server error', 500);
  }
}

// DELETE /api/progress/feedback?id=  — the author, or a coach/admin
async function deleteHandler(request: NextRequest, context: any) {
  try {
    if (!isStaff(context.user.role)) return fail('Forbidden', 403);
    const id = int(new URL(request.url).searchParams.get('id'));
    if (!id) return fail('id is required');
    const row = await prisma.progressFeedback.findUnique({ where: { id } });
    if (!row) return fail('Not found', 404);
    if (row.authorId !== context.user.userId && context.user.role === 'trainer') return fail('You can only delete your own notes', 403);
    await prisma.progressFeedback.delete({ where: { id } });
    return json({ ok: true });
  } catch (error) {
    console.error('Delete progress feedback error:', error);
    return fail('Internal server error', 500);
  }
}

export const GET = requireActiveSubscription(getHandler);
export const POST = requireActiveSubscription(postHandler);
export const DELETE = requireActiveSubscription(deleteHandler);
