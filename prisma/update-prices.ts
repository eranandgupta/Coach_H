import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PLAN_PRICES } from '../lib/pricing';

const prisma = new PrismaClient();

// Prices + durations come from lib/pricing.ts (single source of truth).
const planUpdates: Record<string, { price: number; duration: number }> = Object.fromEntries(
  Object.entries(PLAN_PRICES).map(([name, p]) => [name, { price: p.price, duration: p.durationDays }])
);

async function main() {
  console.log('💰 Updating subscription plan prices & durations...');

  for (const [name, { price, duration }] of Object.entries(planUpdates)) {
    const updated = await prisma.subscriptionPlan.updateMany({
      where: { name },
      data: { price, duration },
    });
    if (updated.count > 0) {
      console.log(`✅ ${name}: ₹${price}, ${duration} days`);
    } else {
      console.warn(`⚠️  Plan not found: ${name}`);
    }
  }

  console.log('\n✨ Price & duration update complete. Existing user paidAmount records unchanged.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
