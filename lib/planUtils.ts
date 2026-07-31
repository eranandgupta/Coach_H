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
//  - active with a PAST endDate             -> 'expired' (window has passed),
//    EXCEPT Elite (session-based) plans, which stay active while sessions remain.
//  - otherwise the plan currently covers `now` -> 'active' (or 'paused').
export type SubDisplayStatus = 'active' | 'upcoming' | 'paused' | 'expired' | 'cancelled';

export interface SubscriptionWindow {
  status: string;
  startDate: string | Date;
  endDate: string | Date;
  plan?: { name?: string | null } | null;
}

export function subscriptionDisplayStatus(
  sub: SubscriptionWindow,
  now: Date = new Date()
): SubDisplayStatus {
  if (sub.status === 'cancelled') return 'cancelled';
  if (sub.status === 'expired') return 'expired';

  const start = new Date(sub.startDate);
  const end = new Date(sub.endDate);
  const isElite = isElitePlan(sub.plan?.name || '');

  // Queued renewal that has not started yet.
  if (start > now) return 'upcoming';

  if (sub.status === 'paused') return 'paused';

  // Time-based plan whose window has fully passed reads as expired even if the
  // stored status is still 'active' (auto-expire may not have run yet).
  if (end < now && !isElite) return 'expired';

  return 'active';
}

// True only when the subscription actually covers `now` (started, not yet ended,
// or an Elite plan with sessions remaining). Use this — never a raw endDate check —
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
