import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const planUpdates: Record<string, { price: number; duration: number }> = {
  'Kickstart Plan': { price: 1299, duration: 30 },
  'Consistency Plan': { price: 2899, duration: 90 },
  'Strength Plan': { price: 4999, duration: 180 },
  'Mastery Plan': { price: 9999, duration: 365 },
  'Couple Strength': { price: 8999, duration: 180 },
  'Couple Mastery': { price: 17999, duration: 365 },
  'Home Workout': { price: 2499, duration: 90 },
  'Rehabilitation Plan': { price: 3499, duration: 90 },
  'Couple Home Workout Plan': { price: 4299, duration: 90 },
  'Couple Rehabilitation Plan': { price: 5999, duration: 90 },
  'Elite 1:1 - 1 Month (24 Sessions)': { price: 12999, duration: 30 },
  'Elite 1:1 - 1 Month (12 Sessions)': { price: 7999, duration: 30 },
  'Elite 1:1 - 3 Months (72 Sessions)': { price: 31999, duration: 90 },
  'Elite 1:1 - 3 Months (36 Sessions)': { price: 19999, duration: 90 },
  'Elite 1:1 Couple - 1 Month (12 Sessions)': { price: 12999, duration: 30 },
  'Elite 1:1 Couple - 1 Month (24 Sessions)': { price: 19999, duration: 30 },
  'Elite 1:1 Couple - 3 Months (36 Sessions)': { price: 30999, duration: 90 },
  'Elite 1:1 Couple - 3 Months (72 Sessions)': { price: 47999, duration: 90 },
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
