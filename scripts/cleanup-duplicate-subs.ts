/**
 * Removes EXACT-duplicate userSubscription rows (same user + plan + start + end
 * + amount + payment id). Keeps one row per group — preferring a row that has a
 * real payment id, otherwise the earliest (lowest id). Genuine renewals with
 * different dates are never touched.
 *
 * DRY-RUN by default (prints what it WOULD delete, changes nothing).
 * To actually delete:  npx tsx scripts/cleanup-duplicate-subs.ts --apply
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

function key(s: any) {
  const d = (x: any) => new Date(x).toISOString().slice(0, 10);
  const amt = s.paidAmount != null ? String(s.paidAmount) : '';
  const pay = s.razorpayPaymentId || s.transactionId || '';
  return `${s.userId}|${s.planId}|${d(s.startDate)}|${d(s.endDate)}|${amt}|${pay}`;
}

async function main() {
  const subs = await prisma.userSubscription.findMany({
    include: { user: { select: { name: true, email: true } }, plan: { select: { name: true } } },
    orderBy: [{ userId: 'asc' }, { id: 'asc' }],
  });

  const groups = new Map<string, any[]>();
  for (const s of subs) {
    const k = key(s);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(s);
  }

  const toDelete: any[] = [];
  for (const [, list] of groups) {
    if (list.length < 2) continue;
    // Prefer a row that has a payment id; else keep the earliest (lowest id).
    const withPay = list.find((s) => s.razorpayPaymentId || s.transactionId);
    const keep = withPay || list[0];
    for (const s of list) if (s.id !== keep.id) toDelete.push({ s, keptId: keep.id });
  }

  console.log(`\n${APPLY ? 'APPLYING' : 'DRY RUN'} — ${toDelete.length} duplicate row(s) to delete:\n`);
  for (const { s, keptId } of toDelete) {
    console.log(
      `  DELETE id=${s.id}  (dup of kept id=${keptId})  | ${s.user.name} <${s.user.email}> | ${s.plan.name} | ${new Date(s.startDate).toISOString().slice(0,10)} → ${new Date(s.endDate).toISOString().slice(0,10)} | status=${s.status}`
    );
  }

  if (!APPLY) {
    console.log(`\nNothing changed. Re-run with --apply to delete these ${toDelete.length} row(s).`);
    return;
  }

  let deleted = 0;
  for (const { s } of toDelete) {
    // Guard: never delete a row that has session-tracking children (safety).
    const sessions = await prisma.sessionTracking.count({ where: { subscriptionId: s.id } });
    if (sessions > 0) {
      console.log(`  SKIP id=${s.id} — has ${sessions} session records`);
      continue;
    }
    await prisma.userSubscription.delete({ where: { id: s.id } });
    deleted++;
  }
  console.log(`\nDone. Deleted ${deleted} duplicate row(s).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
