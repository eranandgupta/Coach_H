/**
 * Server-side sale helpers. All sale data (dates, % tables, bonus days) lives in
 * lib/pricing.ts — edit it there; nothing here needs to change for a new sale.
 */
import { getSaleBonusDaysIST, maxSalePercentAnywhere } from '@/lib/pricing';

export { SALES_ENABLED } from '@/lib/pricing';

/**
 * Free bonus days added to the plan at payment for the sale running on today's India date
 * (Vercel runs in UTC; the sale flips at IST midnight).
 */
export function getSaleBonusDays(planName: string, planDurationDays: number, now: Date = new Date()): number {
  return getSaleBonusDaysIST(planName, planDurationDays, now);
}

/**
 * Highest automatic % off a browser anywhere in the world could be showing for this plan
 * right now. /api/payment/create-order uses it as the lowest price it accepts, so a
 * tampered browser can't pay less than a real sale price.
 */
export function maxAutoSalePercent(planName: string, planDurationDays: number, now: Date = new Date()): number {
  return maxSalePercentAnywhere(planName, planDurationDays, now);
}
