import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const planUpdates: Record<string, { price: number; duration: number }> = {
  'Kickstart Plan': { price: 1099, duration: 30 },
  'Consistency Plan': { price: 2499, duration: 90 },
  'Strength Plan': { price: 4299, duration: 180 },
  'Mastery Plan': { price: 8999, duration: 365 },
  'Couple Strength': { price: 7999, duration: 180 },
  'Couple Mastery': { price: 15999, duration: 365 },
  'Home Workout': { price: 2199, duration: 90 },
  'Rehabilitation Plan': { price: 2999, duration: 90 },
  'Couple Home Workout Plan': { price: 3799, duration: 90 },
  'Couple Rehabilitation Plan': { price: 5299, duration: 90 },
  'Elite 1:1 - 1 Month (24 Sessions)': { price: 11999, duration: 30 },
  'Elite 1:1 - 1 Month (12 Sessions)': { price: 7499, duration: 30 },
  'Elite 1:1 - 3 Months (72 Sessions)': { price: 29999, duration: 90 },
  'Elite 1:1 - 3 Months (36 Sessions)': { price: 18999, duration: 90 },
  'Elite 1:1 Couple - 1 Month (12 Sessions)': { price: 11999, duration: 30 },
  'Elite 1:1 Couple - 1 Month (24 Sessions)': { price: 18999, duration: 30 },
  'Elite 1:1 Couple - 3 Months (36 Sessions)': { price: 28999, duration: 90 },
  'Elite 1:1 Couple - 3 Months (72 Sessions)': { price: 44999, duration: 90 },
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
