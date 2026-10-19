/**
 * Finds Elite 1:1 renewals left in an access gap by the old rollover logic: the new Elite plan
 * was queued to start at the old plan's end date, but the old plan was expired immediately, so
 * the client had NO running plan until that date. Under the current rule (lib/subscriptionService.ts)
 * an Elite->Elite renewal starts immediately and ends at old end + new duration — which is exactly
 * the queued row's existing endDate. So the repair only moves startDate to now; endDate, sessions
 * and bonusSessions are untouched.
 *
 * SAFE BY DEFAULT: prints what it WOULD change and exits. Pass --apply to write.
 *   Dry run:  npx tsx scripts/repair-elite-rollover-gap.ts
 *   Apply:    npx tsx scripts/repair-elite-rollover-gap.ts --apply
 *
 * Deploy the new renewal code BEFORE applying.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const d = (x: any) => new Date(x).toISOString().slice(0, 10);
const APPLY = process.argv.includes('--apply');

function isElite(name: string) {
  return /elite\s*1\s*[:\-]?\s*1/i.test(name || '');
}

async function main() {
  const now = new Date();

  const queued = await prisma.userSubscription.findMany({
    where: { status: { in: ['active', 'paused'] }, startDate: { gt: now } },
    include: { plan: true, user: { select: { id: true, name: true, email: true } } },
  });

  const flagged: typeof queued = [];
  for (const sub of queued) {
    if (!isElite(sub.plan.name)) continue;
    // Gap only if nothing covers the client today.
    const covering = await prisma.userSubscription.findFirst({
      where: { userId: sub.userId, status: { in: ['active', 'paused'] }, startDate: { lte: now }, endDate: { gte: now } },
    });
    if (covering) continue;
    // ...and the predecessor was an Elite plan expired early, ending exactly where this one starts.
    const predecessor = await prisma.userSubscription.findFirst({
      where: { userId: sub.userId, id: { not: sub.id }, status: 'expired', endDate: sub.startDate },
      include: { plan: true },
    });
    if (!predecessor || !isElite(predecessor.plan.name)) continue;
    flagged.push(sub);
    console.log(
      `#${sub.id} ${sub.user.name} <${sub.user.email}> ${sub.plan.name}: ` +
        `starts ${d(sub.startDate)} -> ${d(now)}, ends ${d(sub.endDate)} (unchanged), ` +
        `bonusSessions ${sub.bonusSessions}, predecessor #${predecessor.id}`
    );
  }

  console.log(`\n${flagged.length} subscription(s) in an Elite rollover gap.`);
  if (!APPLY) {
    console.log('Dry run — nothing written. Re-run with --apply to fix.');
    return;
  }
  for (const sub of flagged) {
    await prisma.userSubscription.updateMany({
      where: { id: sub.id, startDate: sub.startDate },
      data: { startDate: now },
    });
  }
  console.log(`Updated ${flagged.length} subscription(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
