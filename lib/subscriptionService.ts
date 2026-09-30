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

/**
 * Thrown when a Razorpay payment already has a subscription. /payment/verify and the
 * payment.captured webhook both process every payment and can run concurrently; without this
 * the second one saw the first's row as "current" and QUEUED a duplicate plan after it
 * (one payment -> active plan + phantom "upcoming" plan). The @unique on
 * UserSubscription.razorpayPaymentId is the hard guarantee; this check makes the common case clean.
 */
export class DuplicatePaymentError extends Error {
  code = 'DUPLICATE_PAYMENT';
  constructor(paymentId: string) {
    super(`Payment ${paymentId} already has a subscription`);
  }
}

/** True for our pre-check or Prisma's unique-constraint violation (P2002) on the payment id. */
export function isDuplicatePaymentError(e: any): boolean {
  return e instanceof DuplicatePaymentError || e?.code === 'DUPLICATE_PAYMENT' || e?.code === 'P2002';
}

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

  if (razorpayPaymentId) {
    const existing = await db.userSubscription.findFirst({ where: { razorpayPaymentId } });
    if (existing) throw new DuplicatePaymentError(razorpayPaymentId);
  }

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

// Transient Prisma errors worth retrying: P2028 (interactive transaction timed out / closed),
// P2034 (write conflict / deadlock), P1001/P1002/P1017 (DB unreachable / connection dropped).
const RETRYABLE_TX_CODES = new Set(['P2028', 'P2034', 'P1001', 'P1002', 'P1017']);

/**
 * Runs a payment-fulfilment transaction with a generous timeout and retries transient
 * failures. A paid customer must never be lost to a slow DB round trip — the transaction
 * rolls back cleanly on failure, so re-running it is safe. Duplicate-payment errors are
 * NOT retried (they mean the other route already fulfilled the payment).
 */
export async function runPaymentTransaction<T>(
  fn: (tx: any) => Promise<T>,
  attempts = 3
): Promise<T> {
  let lastError: any;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await prisma.$transaction(fn, { maxWait: 10000, timeout: 15000 });
    } catch (e: any) {
      lastError = e;
      if (isDuplicatePaymentError(e) || !RETRYABLE_TX_CODES.has(e?.code) || i === attempts) throw e;
      console.warn(`Payment transaction attempt ${i} failed (${e.code}) — retrying`);
      await new Promise((r) => setTimeout(r, 500 * i));
    }
  }
  throw lastError;
}
