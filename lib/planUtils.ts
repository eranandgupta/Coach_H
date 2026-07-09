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
