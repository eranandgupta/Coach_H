import { prisma } from './prisma';
import { isElitePlan, getEffectiveTotalSessions } from './planUtils';

/**
 * Shared subscription create/renew logic. Encodes the agreed renewal policy:
 *
 *  - Calendar stacking: if the client already has an active/paused subscription whose
 *    endDate is in the future, the new plan is QUEUED after it (startDate = current endDate)
 *    so no already-paid time is forfeited. Otherwise it starts today.
 *  - Session rollover: when renewing one Elite (session-based) plan with another, any UNUSED
 *    sessions from the current plan are rolled over onto the new plan as `bonusSessions`
 *    (e.g. 5 left + 72 new = 77 total). Progress is NOT copied as completed sessions.
 *  - Superseding: when the renewal starts TODAY (no future-dated coverage left), or when it is
 *    an Elite->Elite session rollover (sessions carried onto the new plan), the previous
 *    active/paused subscription is marked `expired`. But when a time-based plan is renewed
 *    EARLY — i.e. queued behind a still-valid subscription — the current subscription is left
 *    `active` until its own endDate passes; the new row is created `active` too but, because it
 *    starts in the future, it reads as `upcoming` everywhere (see subscriptionDisplayStatus).
 *    This prevents the "renew early -> current plan instantly shows Expired" bug.
 *
 * Pass a Prisma transaction client as `db` to run inside an existing `$transaction`.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface CreateOrRenewParams {
  userId: number;
  plan: { id: number; name: string; duration: number };
  /** Optional custom duration (days) overriding the plan's default duration. */
  duration?: number | null;
  paymentMode?: string | null;
  transactionId?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  paidAmount?: number | null;
  customerGoal?: string | null;
  customerNotes?: string | null;
}

// Accepts the base PrismaClient or a transaction client.
type Db = any;

export async function createOrRenewSubscription(
  params: CreateOrRenewParams,
  db: Db = prisma
) {
  const {
    userId,
    plan,
    duration,
    paymentMode = null,
    transactionId = null,
    razorpayOrderId = null,
    razorpayPaymentId = null,
    razorpaySignature = null,
    paidAmount = null,
    customerGoal = null,
    customerNotes = null,
  } = params;

  const now = new Date();

  // Current active/paused subscription being superseded (if any).
  const previousSub = await db.userSubscription.findFirst({
    where: { userId, status: { in: ['active', 'paused'] } },
    include: { plan: true, sessionTrackings: true },
    orderBy: { createdAt: 'desc' },
  });

  const durationDays = duration ?? plan.duration;

  // Calendar stacking: queue after the current endDate if it is still in the future.
  const isStacking = !!(previousSub && new Date(previousSub.endDate) > now);
  let startDate = now;
  if (isStacking) {
    startDate = new Date(previousSub.endDate);
  }
  const endDate = new Date(startDate.getTime() + durationDays * MS_PER_DAY);

  // Session rollover (Elite -> Elite only): carry unused sessions as bonus on the new plan.
  const isSessionRollover = !!(
    previousSub &&
    isElitePlan(previousSub.plan.name) &&
    isElitePlan(plan.name)
  );
  let bonusSessions = 0;
  if (isSessionRollover) {
    const prevTotal =
      getEffectiveTotalSessions(previousSub.plan.name, previousSub.bonusSessions) ?? 0;
    const prevCompleted = previousSub.sessionTrackings.length;
    bonusSessions = Math.max(0, prevTotal - prevCompleted);
  }

  if (isStacking && !isSessionRollover) {
    // Early renewal of a time-based plan: the new plan is QUEUED after the current one.
    // Leave the still-valid current subscription active until its endDate passes — it is the
    // one covering the client right now. Only clear rows whose window has already ended.
    // (The queued new row is created 'active' below but reads as 'upcoming' until it starts.)
    await db.userSubscription.updateMany({
      where: { userId, status: { in: ['active', 'paused'] }, endDate: { lte: now } },
      data: { status: 'expired', pausedAt: null },
    });
  } else {
    // Renewal starts today (no future-dated coverage) or an Elite session rollover where the
    // unused sessions have been carried onto the new plan — supersede all current coverage.
    await db.userSubscription.updateMany({
      where: { userId, status: { in: ['active', 'paused'] } },
      data: { status: 'expired', pausedAt: null },
    });
  }

  // Create the new subscription.
  const subscription = await db.userSubscription.create({
    data: {
      userId,
      planId: plan.id,
      status: 'active',
      startDate,
      endDate,
      bonusSessions,
      paymentMode,
      transactionId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paidAmount,
      customerGoal,
      customerNotes,
    },
    include: {
      plan: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return { subscription, previousSub, bonusSessions, startDate, endDate };
}
