/**
 * Server-side sale logic for the July "Health Revolution Sale" (10–31 July).
 *
 * The sale is India-time; Vercel runs in UTC, so we evaluate the date in IST
 * (UTC+5:30) so the sale flips exactly at IST midnight, matching the storefront.
 *
 * Discounts are applied to the Razorpay order amount on the client. This module
 * only handles the BONUS DAYS, which must be added to the actual subscription
 * length at checkout — so it lives on the server.
 */

/**
 * Master on/off switch for ALL plan offers (sale banner, strikethrough "% OFF" pricing,
 * "+N days free" badges, and checkout bonus days). Flip to `true` to run a seasonal sale;
 * the existing date logic and discount/bonus tables resume automatically. Kept `false`
 * to keep every offer surface off site-wide.
 */
export const SALES_ENABLED = false;

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function istParts(now: Date) {
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  return { month: ist.getUTCMonth(), day: ist.getUTCDate(), year: ist.getUTCFullYear() };
}

/** True during 10–31 July (IST). month is 0-indexed, so July === 6. */
export function isJulySaleActive(now: Date = new Date()): boolean {
  if (!SALES_ENABLED) return false;
  const { month, day } = istParts(now);
  return month === 6 && day >= 10 && day <= 31;
}

/**
 * Free bonus days for a plan during the active sale (0 outside the window):
 *   - Gym 6-month (incl. couple): +5
 *   - Gym 12-month (incl. couple): +10
 *   - Elite 1:1 24 sessions: +3
 *   - Elite 1:1 72 sessions: +7
 */
export function getSaleBonusDays(
  planName: string,
  planDurationDays: number,
  now: Date = new Date()
): number {
  if (!isJulySaleActive(now)) return 0;
  const name = (planName || '').toLowerCase();

  if (name.includes('elite') || name.includes('1:1')) {
    if (name.includes('24 session')) return 3;
    if (name.includes('72 session')) return 7;
    return 0;
  }
  // Time-based gym plans (couple variants share the same durations). Thresholds are
  // widened so a 12-month plan stored as 360 or 365 days both qualify for +10, and a
  // 6-month plan (180) for +5, while 3-month (90) and 1-month (30) get nothing.
  if (planDurationDays >= 330) return 10; // ~12 months
  if (planDurationDays >= 150) return 5;  // ~6 months
  return 0;
}
