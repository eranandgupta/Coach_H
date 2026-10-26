import { prisma } from './prisma';
import {
  MS_PER_DAY,
  computeQueuePushes,
  computeRenewalWindow,
  eliteSessionsExhausted,
  getMaxPauseDays,
  pauseGraceEnd,
  type RenewalSource,
} from './planUtils';

/**
 * Shared subscription create/renew logic. Every path that creates a plan — payment verify, the
 * payment.captured webhook, and the admin/coach routes — goes through createOrRenewSubscription.
 * Plans never auto-renew: a new row is only created after a verified payment or an admin action.
 *
 *  - Calendar stacking: if the client already has coverage (the plan running now and/or plans
 *    queued after it), the new plan is QUEUED after the latest of them, so no paid time is lost.
 *    Otherwise it starts now. endDate = startDate + duration days. Existing plans are left alone:
 *    the running plan stays usable until its own endDate, and the queued row reads as `upcoming`
 *    (see subscriptionDisplayStatus) and grants no access until its startDate.
 *  - Elite session rollover: renewing a RUNNING Elite plan with another Elite plan (nothing
 *    queued) carries the unused sessions onto the new plan as `bonusSessions`, and the new plan
 *    starts now and ends at the old plan's end + the new duration, so the remaining days carry
 *    over too. The old plan is marked `expired` (its session history stays on it). Before this,
 *    the new Elite plan was queued at the old end date while the old one was expired at once —
 *    leaving the client with no running plan until the old end date.
 *  - Sessions only roll over from a plan that is still running: a plan whose days have run out
 *    has expired, and its unused sessions with it (owner rule, 2026-10-13).
 *  - The user's row is locked for the whole renewal, so two payments processed concurrently can't
 *    both read the same plan and roll its sessions over twice.
 *
 * Pass a Prisma transaction client as `db` to run inside an existing `$transaction`; called with
 * the base client it opens its own transaction.
 */

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
 * Thrown when a gateway payment already has a subscription. /payment/verify and the
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

const RUNNING = ['active', 'paused'];

/** Plans a client holds that haven't ended: the one covering `now` and any queued after it. */
async function loadCoverage(db: Db, userId: number, now: Date) {
  const rows = await db.userSubscription.findMany({
    where: { userId, status: { in: RUNNING } },
    include: { plan: true, _count: { select: { sessionTrackings: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const toSource = (r: any): RenewalSource => ({ ...r, completedSessions: r._count.sessionTrackings });
  const live = rows.filter((r: any) => !isRowEnded(r, now));
  const current = live.find((r: any) => new Date(r.startDate) <= now) || null;
  const queued = live.filter((r: any) => new Date(r.startDate) > now);
  return { current: current ? toSource(current) : null, queued: queued.map(toSource), rows: live };
}

/** An active/paused row that no longer grants anything: past its end (pause grace aside) or out of Elite sessions. */
function isRowEnded(r: any, now: Date): boolean {
  if (new Date(r.endDate) < now && !(r.status === 'paused' && pauseGraceEnd(r) >= now)) return true;
  return eliteSessionsExhausted(r.plan.name, r.bonusSessions, r._count.sessionTrackings);
}

/**
 * The subscription that actually covers `now` for a client: started, not ended (pause grace
 * included), not out of Elite sessions, and not cancelled/expired. A queued renewal that starts
 * later is never returned. Use this instead of "newest row with endDate >= now".
 */
export async function findCurrentSubscription(db: Db, userId: number, now: Date = new Date()) {
  const rows = await db.userSubscription.findMany({
    where: { userId, status: { in: RUNNING }, startDate: { lte: now } },
    include: { plan: true, _count: { select: { sessionTrackings: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return rows.find((r: any) => !isRowEnded(r, now)) || null;
}

/**
 * After `anchor`'s endDate moved later, push the client's queued plans that now overlap it so they
 * start when it ends. Each move is conditional on the row's startDate being unchanged, so a
 * concurrent run can't apply the same shift twice.
 */
export async function pushQueuedAfter(
  db: Db,
  anchor: { id: number; userId: number; startDate: Date | string; endDate: Date | string },
  now: Date = new Date()
) {
  const after = new Date(Math.max(now.getTime(), new Date(anchor.startDate).getTime()));
  const queued = await db.userSubscription.findMany({
    where: { userId: anchor.userId, id: { not: anchor.id }, status: { in: RUNNING }, startDate: { gt: after } },
    select: { id: true, startDate: true, endDate: true },
  });
  const moves = computeQueuePushes(new Date(anchor.endDate), queued);
  for (const m of moves) {
    await db.userSubscription.updateMany({
      where: { id: m.id, startDate: m.fromStart },
      data: { startDate: m.startDate, endDate: m.endDate },
    });
  }
  return moves.length;
}

export async function createOrRenewSubscription(
  params: CreateOrRenewParams,
  db: Db = prisma
): Promise<any> {
  if (db === prisma) {
    return prisma.$transaction((tx: any) => createOrRenewSubscription(params, tx), {
      maxWait: 10000,
      timeout: 15000,
    });
  }

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

  // Serialise renewals per client (released when the transaction ends).
  await db.$queryRaw`SELECT id FROM \`User\` WHERE id = ${userId} FOR UPDATE`;

  if (razorpayPaymentId) {
    const existing = await db.userSubscription.findFirst({ where: { razorpayPaymentId } });
    if (existing) throw new DuplicatePaymentError(razorpayPaymentId);
  }

  const now = new Date();

  // Settle stale rows first (overdue pauses resumed, ended plans expired) so the policy below
  // sees the same state access checks would.
  await reconcileSubscriptions(db, { userId, now });

  const { current, queued } = await loadCoverage(db, userId, now);
  const durationDays = duration ?? plan.duration;
  const window = computeRenewalWindow(current, queued, plan.name, durationDays, now);

  if (window.supersedeId) {
    // Elite rollover: the unused sessions (and days) are now on the new plan.
    await db.userSubscription.updateMany({
      where: { id: window.supersedeId, status: { in: RUNNING } },
      data: { status: 'expired', pausedAt: null },
    });
    console.log(
      `Elite rollover for user ${userId}: subscription ${window.supersedeId} superseded, ` +
        `${window.bonusSessions} session(s) carried over`
    );
  }

  const subscription = await db.userSubscription.create({
    data: {
      userId,
      planId: plan.id,
      status: 'active',
      startDate: window.startDate,
      endDate: window.endDate,
      bonusSessions: window.bonusSessions,
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

  return {
    subscription,
    previousSub: current,
    bonusSessions: window.bonusSessions,
    startDate: window.startDate,
    endDate: window.endDate,
  };
}

/** True when the client has already paid for a plan that continues after `sub` ends — no renewal reminder needed. */
export async function hasRenewalAfter(db: Db, sub: { id: number; userId: number; endDate: Date | string }) {
  const later = await db.userSubscription.findFirst({
    where: { userId: sub.userId, id: { not: sub.id }, status: { in: RUNNING }, endDate: { gt: new Date(sub.endDate) } },
    select: { id: true },
  });
  return !!later;
}

export interface ReconcileResult {
  resumed: number;
  expired: number;
  queuePushed: number;
}

/**
 * Brings stored statuses in line with the dates and session counts. Safe to run repeatedly and
 * concurrently: every write is conditional on the row still being in the state it was read in.
 *  1. Paused plans that reached their max pause days auto-resume: endDate += max pause days,
 *     exactly once, and any queued plan they now overlap is pushed back.
 *  2. Active plans past endDate, and paused plans past endDate + max pause days, expire.
 *  3. Elite 1:1 plans with every session used expire, even with days left.
 * Omit `userId` to reconcile every client (the daily cron).
 */
export async function reconcileSubscriptions(
  db: Db = prisma,
  opts: { userId?: number; now?: Date } = {}
): Promise<ReconcileResult> {
  const now = opts.now ?? new Date();
  const result: ReconcileResult = { resumed: 0, expired: 0, queuePushed: 0 };

  const rows = await db.userSubscription.findMany({
    where: { ...(opts.userId ? { userId: opts.userId } : {}), status: { in: RUNNING } },
    include: { plan: true, _count: { select: { sessionTrackings: true } } },
  });

  for (const r of rows) {
    let row = r;

    if (row.status === 'paused' && row.pausedAt) {
      const maxPause = getMaxPauseDays(row.plan.duration, row.plan.name);
      const daysPaused = Math.ceil((now.getTime() - new Date(row.pausedAt).getTime()) / MS_PER_DAY);
      if (daysPaused >= maxPause) {
        const newEnd = new Date(new Date(row.endDate).getTime() + maxPause * MS_PER_DAY);
        const { count } = await db.userSubscription.updateMany({
          where: { id: row.id, status: 'paused', pausedAt: row.pausedAt },
          data: { status: 'active', pausedAt: null, pauseDaysUsed: maxPause, endDate: newEnd },
        });
        if (count) {
          result.resumed++;
          row = { ...row, status: 'active', pausedAt: null, endDate: newEnd };
          result.queuePushed += await pushQueuedAfter(db, row, now);
        }
      }
    }

    if (isRowEnded(row, now)) {
      const { count } = await db.userSubscription.updateMany({
        where: { id: row.id, status: row.status },
        data: { status: 'expired', pausedAt: null },
      });
      result.expired += count;
    }
  }

  return result;
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
