import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const planUpdates: Record<string, { price: number; duration: number }> = {
  'Kickstart Plan': { price: 999, duration: 30 },
  'Consistency Plan': { price: 2099, duration: 90 },
  'Strength Plan': { price: 3599, duration: 180 },
  'Mastery Plan': { price: 7499, duration: 365 },
  'Couple Strength': { price: 6999, duration: 180 },
  'Couple Mastery': { price: 13899, duration: 365 },
  'Home Workout': { price: 1799, duration: 90 },
  'Rehabilitation Plan': { price: 2299, duration: 90 },
  'Couple Home Workout Plan': { price: 3099, duration: 90 },
  'Couple Rehabilitation Plan': { price: 4099, duration: 90 },
  'She Strong Program': { price: 999, duration: 30 },
  'Active Parents Program': { price: 999, duration: 30 },
  'Elite 1:1 - 1 Month (24 Sessions)': { price: 9999, duration: 30 },
  'Elite 1:1 - 1 Month (12 Sessions)': { price: 5999, duration: 30 },
  'Elite 1:1 - 3 Months (72 Sessions)': { price: 23999, duration: 90 },
  'Elite 1:1 - 3 Months (36 Sessions)': { price: 15999, duration: 90 },
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
