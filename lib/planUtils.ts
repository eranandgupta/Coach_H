export function isElitePlan(planName: string): boolean {
  // Tolerant match: case-insensitive and separator-flexible (e.g. "Elite 1:1", "elite 1-1", "Elite 1 : 1").
  return /elite\s*1\s*[:\-]?\s*1/i.test(planName || '');
}

export function getTotalSessions(planName: string): number | null {
  // Match "N Sessions" with or without surrounding parentheses (e.g. "(24 Sessions)" or "24 Session").
  const match = (planName || '').match(/(\d+)\s*sessions?/i);
  return match ? parseInt(match[1], 10) : null;
}

// Effective total sessions for a subscription: the plan's nominal sessions plus any
// bonus sessions rolled over from a previous plan on renewal.
export function getEffectiveTotalSessions(
  planName: string,
  bonusSessions: number = 0
): number | null {
  const base = getTotalSessions(planName);
  if (base === null) return bonusSessions > 0 ? bonusSessions : null;
  return base + (bonusSessions || 0);
}

// A subscription's status for DISPLAY / gating purposes, derived from its date
// window rather than the raw stored `status` string. This is what makes calendar
// stacking work: a plan that was paid for but starts in the future is `upcoming`,
// NOT `active` (it must not read as the current plan) and NOT `expired`.
//
// Rules:
//  - cancelled / expired stored status is respected as-is.
//  - active/paused with a FUTURE startDate  -> 'upcoming' (queued renewal).
//  - active with a PAST endDate             -> 'expired' (window has passed). This applies
//    to Elite 1:1 plans too: they end when the days run out OR the sessions run out,
//    whichever comes first.
//  - Elite 1:1 with every session completed -> 'expired' (when session data is supplied).
//  - otherwise the plan currently covers `now` -> 'active' (or 'paused').
export type SubDisplayStatus = 'active' | 'upcoming' | 'paused' | 'expired' | 'cancelled';

export interface SubscriptionWindow {
  status: string;
  startDate: string | Date;
  endDate: string | Date;
  pausedAt?: string | Date | null;
  plan?: { name?: string | null; duration?: number | null } | null;
  bonusSessions?: number | null;
  /** Optional: pass completed sessions so Elite plans read as expired once all are used. */
  sessionTrackings?: unknown[] | null;
}

/** True when an Elite 1:1 subscription has used every session it was sold (incl. rolled-over bonus). */
export function eliteSessionsExhausted(planName: string, bonusSessions: number | null | undefined, completed: number): boolean {
  if (!isElitePlan(planName)) return false;
  const total = getEffectiveTotalSessions(planName, bonusSessions || 0);
  return !!total && completed >= total;
}

export function subscriptionDisplayStatus(
  sub: SubscriptionWindow,
  now: Date = new Date()
): SubDisplayStatus {
  if (sub.status === 'cancelled') return 'cancelled';
  if (sub.status === 'expired') return 'expired';

  const start = new Date(sub.startDate);
  const end = new Date(sub.endDate);

  // Queued renewal that has not started yet.
  if (start > now) return 'upcoming';

  // Window has fully passed: expired even if the stored status is still 'active'
  // (auto-expire may not have run yet). Applies to every plan, Elite included.
  // A PAUSED plan keeps its max-pause-days grace past endDate (the pause days are added back
  // on resume) — the same rule checkSubscription / reconcileSubscriptions apply.
  if (end < now && !(sub.status === 'paused' && pauseGraceEnd(sub) >= now)) return 'expired';

  // Elite 1:1: all sessions used up ends the plan even with days remaining.
  if (Array.isArray(sub.sessionTrackings) && eliteSessionsExhausted(sub.plan?.name || '', sub.bonusSessions, sub.sessionTrackings.length)) {
    return 'expired';
  }

  if (sub.status === 'paused') return 'paused';
  return 'active';
}

// True only when the subscription actually covers `now` (started, not yet ended,
// and for Elite plans, sessions remaining when session data is supplied). Use this — never a raw endDate check —
// to decide whether a client is currently entitled to a plan.
export function isSubscriptionCurrentlyActive(
  sub: SubscriptionWindow,
  now: Date = new Date()
): boolean {
  const s = subscriptionDisplayStatus(sub, now);
  return s === 'active' || s === 'paused';
}

export function getSessionLabel(weekNumber: number, isElite: boolean): string {
  return isElite ? `Session ${weekNumber}` : `Week ${weekNumber}`;
}

export function getSessionLabelShort(index: number, isElite: boolean): string {
  return isElite ? `S${index}` : `W${index}`;
}

/**
 * Returns the maximum pause days allowed for a subscription based on plan duration.
 * - 6 months (180 days) → 7 days
 * - 12 months (365 days) → 15 days
 * - Elite 1:1 3 months (90 days) → 7 days
 * Returns 0 if pause is not allowed for the plan.
 */
export function getMaxPauseDays(planDuration: number, planName: string): number {
  // Elite 1:1 3-month plans get 7 days
  if (isElitePlan(planName) && planDuration >= 90) {
    return 7;
  }
  // 12-month plans (365 days)
  if (planDuration >= 365) {
    return 15;
  }
  // 6-month plans (180 days)
  if (planDuration >= 180) {
    return 7;
  }
  return 0;
}

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Last moment a PAUSED plan is still valid: endDate + the plan's max pause days. */
export function pauseGraceEnd(sub: SubscriptionWindow): Date {
  const end = new Date(sub.endDate);
  if (!sub.plan || sub.plan.duration == null) return end; // no plan data -> no grace
  return new Date(end.getTime() + getMaxPauseDays(sub.plan.duration, sub.plan.name || '') * MS_PER_DAY);
}

/** Days a paused plan has been paused so far, capped at its max — what resume would add back. */
export function pauseDaysAccrued(sub: SubscriptionWindow, now: Date = new Date()): number {
  if (sub.status !== 'paused' || !sub.pausedAt || !sub.plan || sub.plan.duration == null) return 0;
  const days = Math.ceil((now.getTime() - new Date(sub.pausedAt).getTime()) / MS_PER_DAY);
  return Math.max(0, Math.min(days, getMaxPauseDays(sub.plan.duration, sub.plan.name || '')));
}

/** The endDate a plan would have if it were resumed right now (endDate itself unless paused). */
export function projectedEndDate(sub: SubscriptionWindow, now: Date = new Date()): Date {
  return new Date(new Date(sub.endDate).getTime() + pauseDaysAccrued(sub, now) * MS_PER_DAY);
}

export interface RenewalSource {
  id: number;
  status: string;
  startDate: string | Date;
  endDate: string | Date;
  pausedAt?: string | Date | null;
  bonusSessions?: number | null;
  plan: { name: string; duration: number };
  completedSessions: number;
}

export interface RenewalWindow {
  startDate: Date;
  endDate: Date;
  bonusSessions: number;
  /** Subscription the new one replaces outright (Elite rollover); it must be expired. */
  supersedeId: number | null;
}

/**
 * Pure renewal policy (see lib/subscriptionService.ts for the full write-up).
 *  - `current`: the plan covering `now`, or null. `queued`: plans already paid for that start later.
 *  - Elite -> Elite while the current Elite plan is running and nothing is queued: the new plan
 *    starts NOW, carries the unused sessions as bonusSessions, and ends at the current plan's
 *    (projected) end + the new duration, so no paid day or session is lost and there is no
 *    access gap. The current plan is superseded.
 *  - Everything else: calendar stacking — start at the latest end of current + queued coverage
 *    (or now if there is none), and leave the existing plans untouched.
 */
export function computeRenewalWindow(
  current: RenewalSource | null,
  queued: RenewalSource[],
  newPlanName: string,
  durationDays: number,
  now: Date = new Date()
): RenewalWindow {
  if (current && queued.length === 0 && isElitePlan(current.plan.name) && isElitePlan(newPlanName)) {
    const total = getEffectiveTotalSessions(current.plan.name, current.bonusSessions || 0) ?? 0;
    const bonusSessions = Math.max(0, total - current.completedSessions);
    const carriedEnd = Math.max(now.getTime(), projectedEndDate(current, now).getTime());
    return {
      startDate: now,
      endDate: new Date(carriedEnd + durationDays * MS_PER_DAY),
      bonusSessions,
      supersedeId: current.id,
    };
  }

  let anchor = now.getTime();
  if (current) anchor = Math.max(anchor, projectedEndDate(current, now).getTime());
  for (const q of queued) anchor = Math.max(anchor, new Date(q.endDate).getTime());
  const startDate = new Date(anchor);
  return {
    startDate,
    endDate: new Date(anchor + durationDays * MS_PER_DAY),
    bonusSessions: 0,
    supersedeId: null,
  };
}

/**
 * After a plan's endDate moves later (resume, adjust-days, admin edit), queued plans that now
 * overlap it are pushed forward so they start when it ends, keeping each one's length. Only ever
 * pushes forward — it never pulls a queued plan earlier. Returns the moves to apply.
 */
export function computeQueuePushes(
  anchorEnd: Date,
  queued: { id: number; startDate: string | Date; endDate: string | Date }[]
): { id: number; fromStart: Date; startDate: Date; endDate: Date }[] {
  const moves: { id: number; fromStart: Date; startDate: Date; endDate: Date }[] = [];
  let cursor = anchorEnd.getTime();
  const ordered = [...queued].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  for (const q of ordered) {
    const start = new Date(q.startDate).getTime();
    const end = new Date(q.endDate).getTime();
    if (start < cursor) {
      const shift = cursor - start;
      moves.push({ id: q.id, fromStart: new Date(start), startDate: new Date(cursor), endDate: new Date(end + shift) });
      cursor = end + shift;
    } else {
      cursor = Math.max(cursor, end);
    }
  }
  return moves;
}
