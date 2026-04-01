import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newPrices: Record<string, number> = {
  'Kickstart Plan': 999,
  'Consistency Plan': 2099,
  'Strength Plan': 3599,
  'Mastery Plan': 7499,
  'Couple Strength Plan': 6999,
  'Couple Mastery Plan': 13899,
  'Home Workout': 1799,
  'Rehabilitation Plan': 2299,
};

async function main() {
  console.log('💰 Updating subscription plan prices...');

  for (const [name, price] of Object.entries(newPrices)) {
    const updated = await prisma.subscriptionPlan.updateMany({
      where: { name },
      data: { price },
    });
    if (updated.count > 0) {
      console.log(`✅ ${name}: ₹${price}`);
    } else {
      console.warn(`⚠️  Plan not found: ${name}`);
    }
  }

  console.log('\n✨ Price update complete. Existing user paidAmount records unchanged.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
