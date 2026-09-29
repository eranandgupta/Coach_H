/**
 * Remove duplicate subscriptions created from ONE Razorpay payment.
 *
 * Cause: /api/payment/verify and the payment.captured webhook both processed the same payment
 * concurrently. The second saw the first's row as the current plan and queued a phantom
 * "upcoming" plan after it (same razorpayPaymentId, shifted dates). Fixed in
 * lib/subscriptionService.ts; this cleans up rows created before the fix.
 *
 * Keeps the EARLIEST row per payment (its dates are the real ones), copies over any
 * signature / goal / notes only the duplicate has (verify stores them, the webhook doesn't),
 * then deletes the duplicate. Skips a group if a duplicate has session history.
 *
 * Must run BEFORE `npx prisma db push` adds @unique on razorpayPaymentId.
 *
 * Usage:  npx tsx scripts/fix-duplicate-payment-subs.ts          (dry run)
 *         npx tsx scripts/fix-duplicate-payment-subs.ts --apply
 */
import { prisma } from '../lib/prisma';

const APPLY = process.argv.includes('--apply');

async function main() {
  const subs = await prisma.userSubscription.findMany({
    where: { razorpayPaymentId: { not: null } },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { name: true, email: true } },
      plan: { select: { name: true } },
      _count: { select: { sessionTrackings: true } },
    },
  });

  const groups = new Map<string, typeof subs>();
  for (const s of subs) {
    const list = groups.get(s.razorpayPaymentId!) ?? [];
    list.push(s);
    groups.set(s.razorpayPaymentId!, list);
  }

  const dupGroups = Array.from(groups.entries()).filter(([, list]) => list.length > 1);
  console.log(`${dupGroups.length} payment(s) with duplicate subscriptions${APPLY ? '' : ' (dry run)'}\n`);

  for (const [paymentId, [keep, ...dups]] of dupGroups) {
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    console.log(`${paymentId} — ${keep.user.name} <${keep.user.email}> — ${keep.plan.name}`);
    console.log(`  keep   #${keep.id}  ${fmt(keep.startDate)} → ${fmt(keep.endDate)}  (${keep.status})`);
    dups.forEach((d) =>
      console.log(`  delete #${d.id}  ${fmt(d.startDate)} → ${fmt(d.endDate)}  (${d.status}, ${d._count.sessionTrackings} sessions)`)
    );

    if (dups.some((d) => d._count.sessionTrackings > 0)) {
      console.log('  SKIPPED: a duplicate has session history — resolve by hand.\n');
      continue;
    }

    if (APPLY) {
      await prisma.$transaction([
        prisma.userSubscription.update({
          where: { id: keep.id },
          data: {
            razorpaySignature: keep.razorpaySignature ?? dups.find((d) => d.razorpaySignature)?.razorpaySignature ?? null,
            customerGoal: keep.customerGoal ?? dups.find((d) => d.customerGoal)?.customerGoal ?? null,
            customerNotes: keep.customerNotes ?? dups.find((d) => d.customerNotes)?.customerNotes ?? null,
          },
        }),
        prisma.userSubscription.deleteMany({ where: { id: { in: dups.map((d) => d.id) } } }),
      ]);
      console.log('  done\n');
    } else {
      console.log('');
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
