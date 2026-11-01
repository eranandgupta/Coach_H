import { prisma } from '@/lib/prisma';
import { PLAN_PRICES } from '@/lib/pricing';

/**
 * Brings each DB `SubscriptionPlan.price` in line with lib/pricing.ts (matched by name).
 * Checkout already prices from lib/pricing.ts; this keeps admin screens, invoices and
 * reports showing the same numbers. Runs in the daily reconcile cron. Idempotent.
 */
export async function syncPlanPrices(apply = true) {
  const rows = await prisma.subscriptionPlan.findMany({ select: { id: true, name: true, price: true } });
  const changes: { id: number; name: string; from: number; to: number }[] = [];
  for (const row of rows) {
    const target = (PLAN_PRICES as Record<string, { price: number }>)[row.name]?.price;
    if (target != null && Number(row.price) !== target) {
      changes.push({ id: row.id, name: row.name, from: Number(row.price), to: target });
    }
  }
  if (apply) {
    for (const c of changes) {
      await prisma.subscriptionPlan.update({ where: { id: c.id }, data: { price: c.to } });
    }
  }
  return changes;
}
