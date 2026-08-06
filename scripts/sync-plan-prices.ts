/**
 * Syncs each SubscriptionPlan's `price` in the DB to the canonical selling price
 * (matched by plan name). The DB held stale (lower) prices while the marketing
 * pages + homepage checkout already sell at these prices — this brings the DB
 * (and therefore /api/plans, the renew modal, and admin amounts) into line.
 * Prices below mirror prisma/ensure-plans.ts.
 *
 * DRY-RUN by default (prints old → new, changes nothing).
 * To apply:  npx tsx scripts/sync-plan-prices.ts --apply
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

// name → canonical selling price (INR)
const TARGET: Record<string, number> = {
  'Kickstart Plan': 1299,
  'Consistency Plan': 2899,
  'Strength Plan': 4999,
  'Mastery Plan': 9999,
  'Home Workout': 2499,
  'Rehabilitation Plan': 3499,
  'Couple Strength': 8999,
  'Couple Mastery': 17999,
  'Couple Home Workout Plan': 4299,
  'Couple Rehabilitation Plan': 5999,
  'Elite 1:1 - 1 Month (12 Sessions)': 7999,
  'Elite 1:1 - 1 Month (24 Sessions)': 12999,
  'Elite 1:1 - 3 Months (36 Sessions)': 19999,
  'Elite 1:1 - 3 Months (72 Sessions)': 31999,
  'Elite 1:1 Couple - 1 Month (12 Sessions)': 12999,
  'Elite 1:1 Couple - 1 Month (24 Sessions)': 19999,
  'Elite 1:1 Couple - 3 Months (36 Sessions)': 30999,
  'Elite 1:1 Couple - 3 Months (72 Sessions)': 47999,
};

async function main() {
  const dbPlans = await prisma.subscriptionPlan.findMany();
  const changes: { name: string; from: number; to: number; id: number }[] = [];

  for (const db of dbPlans) {
    const target = TARGET[db.name];
    if (target == null) continue;
    const current = Number(db.price);
    if (current !== target) changes.push({ name: db.name, from: current, to: target, id: db.id });
  }

  console.log(`\n${APPLY ? 'APPLYING' : 'DRY RUN'} — ${changes.length} price change(s):\n`);
  for (const c of changes) console.log(`  ${c.name.padEnd(44)} ₹${c.from}  →  ₹${c.to}`);

  if (!APPLY) {
    console.log(`\nNothing changed. Re-run with --apply to write these ${changes.length} price(s).`);
    return;
  }

  for (const c of changes) {
    await prisma.subscriptionPlan.update({ where: { id: c.id }, data: { price: c.to } });
  }
  console.log(`\nDone. Updated ${changes.length} plan price(s).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
