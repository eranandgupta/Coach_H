/**
 * Repairs subscription rows wrongly marked `expired` by the old early-renewal logic.
 * Uses the SAME detection as scripts/diagnose-stacking-expired-subs.ts and sets each
 * flagged row's status back to `active`. Once `active`, the window-aware status logic
 * renders them correctly (Active if they cover today, Upcoming if they start later).
 *
 * SAFE BY DEFAULT: prints what it WOULD change and exits. Pass --apply to write.
 *   Dry run:  npx tsx scripts/repair-stacking-expired-subs.ts
 *   Apply:    npx tsx scripts/repair-stacking-expired-subs.ts --apply
 *
 * Deploy the window-aware code fix BEFORE applying — otherwise the still-deployed
 * endDate-only code will show every reactivated row as green "active".
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DAY = 24 * 60 * 60 * 1000;
const d = (x: any) => new Date(x).toISOString().slice(0, 10);
const APPLY = process.argv.includes('--apply');

function isElite(name: string) {
  return /elite\s*1\s*[:\-]?\s*1/i.test(name || '');
}

async function main() {
  const now = new Date();

  const subs = await prisma.userSubscription.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      plan: { select: { name: true } },
    },
    orderBy: [{ userId: 'asc' }, { startDate: 'asc' }, { createdAt: 'asc' }],
  });

  const byUser = new Map<number, any[]>();
  for (const s of subs) {
    if (!byUser.has(s.userId)) byUser.set(s.userId, []);
    byUser.get(s.userId)!.push(s);
  }

  const toFix: any[] = [];
  for (const [, list] of byUser) {
    for (const row of list) {
      if (row.status !== 'expired') continue;
      if (isElite(row.plan.name)) continue;
      if (new Date(row.endDate) < now) continue; // window already passed -> genuine expiry

      const successor = list.find(
        (o) =>
          o.id !== row.id &&
          Math.abs(new Date(o.startDate).getTime() - new Date(row.endDate).getTime()) <= 2 * DAY &&
          new Date(o.createdAt).getTime() >= new Date(row.createdAt).getTime()
      );
      if (!successor) continue; // likely a manual Mark Expired -> leave alone

      toFix.push(row);
    }
  }

  console.log(`\n${APPLY ? '=== APPLYING REPAIR ===' : '=== DRY RUN (pass --apply to write) ==='}`);
  console.log(`Rows to reactivate: ${toFix.length}`);
  for (const s of toFix) {
    console.log(
      `  id=${s.id} | ${s.user.name || '?'} <${s.user.email}> | ${s.plan.name} | ${d(s.startDate)} -> ${d(s.endDate)} | expired => active`
    );
  }

  if (!toFix.length) {
    console.log('\nNothing to repair.');
    return;
  }

  if (!APPLY) {
    console.log('\nNo changes made. Re-run with --apply to write.');
    return;
  }

  const ids = toFix.map((s) => s.id);
  const res = await prisma.userSubscription.updateMany({
    where: { id: { in: ids }, status: 'expired' },
    data: { status: 'active' },
  });
  console.log(`\nDone. Rows updated: ${res.count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
