/**
 * READ-ONLY diagnostic. Does NOT modify anything.
 *
 * Finds subscription rows that were wrongly marked `expired` by the old early-renewal
 * logic (which blanket-expired every current sub when a renewal was stacked on top).
 *
 * A row is flagged as "stacking-corrupted" when:
 *   - status === 'expired'
 *   - endDate >= now                (its coverage window has NOT actually passed)
 *   - a later, contiguous row exists (startDate ≈ this row's endDate, created afterward)
 *     i.e. a renewal was queued on top of it — that is what expired it.
 *
 * Rows that are `expired` with a future endDate but NO stacked successor are treated as
 * genuine manual "Mark Expired" actions and are NOT flagged (we must not undo those).
 *
 * Usage: npx tsx scripts/diagnose-stacking-expired-subs.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DAY = 24 * 60 * 60 * 1000;
const d = (x: any) => new Date(x).toISOString().slice(0, 10);

// Elite session-based plans are date-agnostic; skip them (they are never date-expired).
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

  type Flag = {
    user: any;
    row: any;
    proposed: 'active' | 'upcoming'; // what it should become after repair
    successorId: number;
  };
  const flags: Flag[] = [];

  for (const [, list] of byUser) {
    for (const row of list) {
      if (row.status !== 'expired') continue;
      if (isElite(row.plan.name)) continue;
      // Window has already passed -> genuinely expired, not corruption.
      if (new Date(row.endDate) < now) continue;

      // Look for a contiguous successor stacked on top (startDate ≈ this endDate),
      // created after this row -> proves a renewal superseded it.
      const successor = list.find(
        (o) =>
          o.id !== row.id &&
          Math.abs(new Date(o.startDate).getTime() - new Date(row.endDate).getTime()) <= 2 * DAY &&
          new Date(o.createdAt).getTime() >= new Date(row.createdAt).getTime()
      );
      if (!successor) continue; // likely a manual Mark Expired -> leave alone

      const coversNow =
        new Date(row.startDate) <= now && new Date(row.endDate) >= now;
      flags.push({
        user: row.user,
        row,
        proposed: coversNow ? 'active' : 'upcoming',
        successorId: successor.id,
      });
    }
  }

  // Group flags by user for a readable report.
  const flagsByUser = new Map<number, Flag[]>();
  for (const f of flags) {
    if (!flagsByUser.has(f.user.id)) flagsByUser.set(f.user.id, []);
    flagsByUser.get(f.user.id)!.push(f);
  }

  console.log(`\n=== SUMMARY (READ-ONLY — nothing changed) ===`);
  console.log(`Now: ${now.toISOString()}`);
  console.log(`Total subscription rows: ${subs.length}`);
  console.log(`Users affected by stacking-corruption: ${flagsByUser.size}`);
  console.log(`Rows that would be repaired: ${flags.length}`);
  console.log(
    `  -> to 'active' (covers today): ${flags.filter((f) => f.proposed === 'active').length}`
  );
  console.log(
    `  -> to 'upcoming' (queued, future start): ${flags.filter((f) => f.proposed === 'upcoming').length}`
  );

  console.log(`\n=== AFFECTED CLIENTS (full chain shown; >> = would be repaired) ===`);
  for (const [userId, userFlags] of flagsByUser) {
    const chain = byUser.get(userId)!;
    const u = userFlags[0].user;
    const repairIds = new Set(userFlags.map((f) => f.row.id));
    const proposedById = new Map(userFlags.map((f) => [f.row.id, f.proposed]));
    console.log(`\n${u.name || '?'} <${u.email}>`);
    for (const s of chain) {
      const mark = repairIds.has(s.id) ? '>>' : '  ';
      const arrow = repairIds.has(s.id) ? `  ==> ${proposedById.get(s.id)}` : '';
      console.log(
        `  ${mark} id=${s.id} | ${s.plan.name} | ${s.status.padEnd(9)} | ${d(s.startDate)} -> ${d(s.endDate)} | created=${new Date(s.createdAt).toISOString().slice(0, 16)}${arrow}`
      );
    }
  }

  if (!flags.length) {
    console.log('\nNo stacking-corrupted rows found.');
  } else {
    console.log(
      `\nNext step (only if you approve): a repair script will set the ${flags.length} flagged rows back to 'active'.`
    );
    console.log(
      `(They then read as Active/Upcoming automatically via the new window-aware status logic.)`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
