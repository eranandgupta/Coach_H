/**
 * READ-ONLY diagnostic. Does NOT modify anything.
 * Reports duplicate userSubscription rows so we can decide on a cleanup.
 * Usage: npx tsx scripts/diagnose-duplicate-subs.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function key(s: any) {
  // "Exact duplicate" = same user + plan + start + end + amount + payment id.
  const start = new Date(s.startDate).toISOString().slice(0, 10);
  const end = new Date(s.endDate).toISOString().slice(0, 10);
  const amt = s.paidAmount != null ? String(s.paidAmount) : '';
  const pay = s.razorpayPaymentId || s.transactionId || '';
  return `${s.planId}|${start}|${end}|${amt}|${pay}`;
}

async function main() {
  const subs = await prisma.userSubscription.findMany({
    include: { user: { select: { id: true, name: true, email: true } }, plan: { select: { name: true } } },
    orderBy: [{ userId: 'asc' }, { createdAt: 'asc' }],
  });

  // Group by user
  const byUser = new Map<number, any[]>();
  for (const s of subs) {
    if (!byUser.has(s.userId)) byUser.set(s.userId, []);
    byUser.get(s.userId)!.push(s);
  }

  let totalExactDupRows = 0;
  const usersWithDups: string[] = [];

  for (const [, list] of byUser) {
    const seen = new Map<string, number>();
    for (const s of list) seen.set(key(s), (seen.get(key(s)) || 0) + 1);
    const dupGroups = [...seen.values()].filter((c) => c > 1);
    if (dupGroups.length) {
      const extra = dupGroups.reduce((a, c) => a + (c - 1), 0);
      totalExactDupRows += extra;
      usersWithDups.push(`${list[0].user.name || '?'} <${list[0].user.email}>  — ${list.length} rows, ${extra} exact-duplicate extra`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total subscription rows: ${subs.length}`);
  console.log(`Distinct users with subscriptions: ${byUser.size}`);
  console.log(`Users with EXACT duplicate rows: ${usersWithDups.length}`);
  console.log(`Total redundant (exact-duplicate) rows that could be removed: ${totalExactDupRows}`);

  console.log(`\n=== USERS WITH EXACT DUPLICATES ===`);
  usersWithDups.slice(0, 40).forEach((u) => console.log('  ' + u));

  // Spotlight: Artika (from the reported screenshot)
  const artika = subs.filter((s) => (s.user.email || '').toLowerCase().includes('artikaypatel'));
  if (artika.length) {
    console.log(`\n=== ARTIKA (${artika[0].user.email}) — ${artika.length} rows ===`);
    for (const s of artika) {
      console.log(
        `  id=${s.id} | ${s.plan.name} | ${s.status} | ${new Date(s.startDate).toISOString().slice(0,10)} → ${new Date(s.endDate).toISOString().slice(0,10)} | ₹${s.paidAmount ?? '-'} | pay=${s.razorpayPaymentId || s.transactionId || '-'} | created=${new Date(s.createdAt).toISOString().slice(0,16)}`
      );
    }
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
