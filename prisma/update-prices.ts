import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const planUpdates: Record<string, { price: number; duration: number }> = {
  'Kickstart Plan': { price: 999, duration: 30 },
  'Consistency Plan': { price: 2099, duration: 90 },
  'Strength Plan': { price: 3599, duration: 180 },
  'Mastery Plan': { price: 7499, duration: 365 },
  'Couple Strength Plan': { price: 6999, duration: 180 },
  'Couple Mastery Plan': { price: 13899, duration: 365 },
  'Home Workout': { price: 1799, duration: 90 },
  'Rehabilitation Plan': { price: 2299, duration: 90 },
};

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
