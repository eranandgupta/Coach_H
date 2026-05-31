/**
 * Ensures all subscription plans exist in the database.
 * - Creates missing plans
 * - Renames "Home Workout" → "Home Workout Plan" if the old name exists
 * - Safe to run multiple times (idempotent)
 *
 * Usage: npx tsx prisma/ensure-plans.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const requiredPlans = [
  {
    name: 'Kickstart Plan',
    description: 'All Inclusive',
    price: 1099,
    duration: 30,
    features: [
      'Customised workout plan',
      'Personalised diet plan',
      'Gym workout video tutorial',
      'One on one consultation weekly (4/month)',
      'Supplement guidance',
      'WhatsApp support',
      'Lifestyle guidance',
      'Free Habit Tracker',
    ],
  },
  {
    name: 'Consistency Plan',
    description: 'All Inclusive',
    price: 2499,
    duration: 90,
    features: [
      'Customised workout plan',
      'Personalised diet plan',
      'Gym workout video tutorial',
      'One on one consultation weekly (4/month)',
      'Supplement guidance',
      'WhatsApp support',
      'Lifestyle guidance',
      'Free Habit Tracker',
    ],
  },
  {
    name: 'Strength Plan',
    description: 'All Inclusive',
    price: 4299,
    duration: 180,
    features: [
      'Customised workout plan',
      'Personalised diet plan',
      'Gym workout video tutorial',
      'One on one consultation weekly (6/month)',
      'Supplement guidance',
      'WhatsApp support',
      'Lifestyle guidance',
      'Pause option (7 days)',
      'Free Habit Tracker',
      'FREE RhynoGrip Fitness Gear',
    ],
  },
  {
    name: 'Mastery Plan',
    description: 'All Inclusive',
    price: 8999,
    duration: 365,
    features: [
      'Customised workout plan',
      'Personalised diet plan',
      'Full video library (gym, home, rehab)',
      'One on one consultation weekly (6/month)',
      'Supplement guidance',
      'WhatsApp support',
      'Lifestyle guidance',
      'Pause option (15 days)',
      'Free Habit Tracker',
      'FREE RhynoGrip Fitness Gear',
    ],
  },
  {
    name: 'Home Workout',
    description: 'Home Workout',
    price: 2199,
    duration: 90,
    features: [
      'Customised home workout plan',
      'Personalised diet plan',
      'Home workout video tutorial',
      'One on one consultation twice a month',
      'Supplement guidance',
      'WhatsApp support',
      'Lifestyle guidance',
      'Free Habit Tracker',
    ],
  },
  {
    name: 'Rehabilitation Plan',
    description: 'Recovery & Healing',
    price: 2999,
    duration: 90,
    features: [
      'Customised rehabilitation workout',
      'Rehabilitation workout video tutorial',
      'One-on-one consultation twice a month',
      'Supplement guidance',
      'WhatsApp support',
      'Lifestyle guidance',
      'Free Habit Tracker',
    ],
  },
  {
    name: 'Couple Strength',
    description: 'For 2 People',
    price: 7999,
    duration: 180,
    features: [
      'Personalized workout plans for both',
      'Customized meal plans for both',
      'Gym workout video tutorial',
      'One on one consultation weekly (6/month)',
      'Supplement guidance',
      'WhatsApp support',
      'Lifestyle coaching',
      'Pause option (7 days)',
      'Free Habit Tracker',
      'FREE RhynoGrip Fitness Gear',
    ],
  },
  {
    name: 'Couple Mastery',
    description: 'For 2 People',
    price: 15999,
    duration: 365,
    features: [
      'Personalized workout plans for both',
      'Customized meal plans for both',
      'Full video library (gym, home, rehab)',
      'One on one consultation weekly (6/month)',
      'Supplement guidance',
      'WhatsApp support',
      'Lifestyle coaching',
      'Pause option (15 days)',
      'Free Habit Tracker',
      'FREE RhynoGrip Fitness Gear',
    ],
  },
  {
    name: 'She Strong Program',
    description: 'For Housewives Below 50',
    price: 999,
    duration: 30,
    features: [
      'Monday & Wednesday classes',
      '60 min per session',
      'WhatsApp support',
      'HIIT & Bodyweight training',
      'Focus: fat loss, endurance, heart & lungs health',
      'No equipment needed',
      'Max 10 members per group',
    ],
  },
  {
    name: 'Active Parents Program',
    description: 'For Adults 50+',
    price: 999,
    duration: 30,
    features: [
      'Tuesday & Thursday classes',
      '60 min per session',
      'WhatsApp support',
      'Bodyweight training',
      'Focus: Joints & muscle strengthening, balancing & coordination',
      'No equipment needed',
      'Max 10 members per group',
    ],
  },
  {
    name: 'Elite 1:1 - 1 Month (24 Sessions)',
    description: '24 Sessions',
    price: 11999,
    duration: 30,
    features: [
      'Live 1:1 personal training',
      'Personalised diet plan',
      '60 min per session',
      'Supplement guidance',
      'Lifestyle guidance',
      'WhatsApp support',
      'Full video library access',
      'Free Habit Tracker',
    ],
  },
  {
    name: 'Elite 1:1 - 1 Month (12 Sessions)',
    description: '12 Sessions',
    price: 7499,
    duration: 30,
    features: [
      'Live 1:1 personal training',
      'Personalised diet plan',
      '60 min per session',
      'Supplement guidance',
      'Lifestyle guidance',
      'WhatsApp support',
      'Full video library access',
      'Free Habit Tracker',
    ],
  },
  {
    name: 'Elite 1:1 - 3 Months (72 Sessions)',
    description: '72 Sessions',
    price: 29999,
    duration: 90,
    features: [
      'Live 1:1 personal training',
      'Personalised diet plan',
      '60 min per session',
      'Supplement guidance',
      'Lifestyle guidance',
      'WhatsApp support',
      'Full video library access',
      'Pause option (7 days)',
      'Free Habit Tracker',
      'FREE RhynoGrip Fitness Gear',
    ],
  },
  {
    name: 'Elite 1:1 - 3 Months (36 Sessions)',
    description: '36 Sessions',
    price: 18999,
    duration: 90,
    features: [
      'Live 1:1 personal training',
      'Personalised diet plan',
      '60 min per session',
      'Supplement guidance',
      'Lifestyle guidance',
      'WhatsApp support',
      'Full video library access',
      'Pause option (7 days)',
      'Free Habit Tracker',
      'FREE RhynoGrip Fitness Gear',
    ],
  },
  {
    name: 'Couple Home Workout Plan',
    description: 'For 2 People',
    price: 3799,
    duration: 90,
    features: [
      'Customised home workout plans for both',
      'Personalised diet plans for both',
      'Home workout video tutorial',
      'One on one consultation twice a month',
      'Supplement guidance',
      'WhatsApp support',
      'Lifestyle guidance',
      'Free Habit Tracker',
    ],
  },
  {
    name: 'Couple Rehabilitation Plan',
    description: 'For 2 People',
    price: 5299,
    duration: 90,
    features: [
      'Customised rehabilitation workouts for both',
      'Rehabilitation workout video tutorial',
      'One-on-one consultation twice a month',
      'Supplement guidance',
      'WhatsApp support',
      'Lifestyle guidance',
      'Free Habit Tracker',
    ],
  },
];

async function main() {
  console.log('🔍 Checking subscription plans...\n');

  // Ensure all plans exist
  for (const plan of requiredPlans) {
    const existing = await prisma.subscriptionPlan.findFirst({
      where: { name: plan.name },
    });

    if (existing) {
      // Ensure it's active
      if (!existing.isActive) {
        await prisma.subscriptionPlan.update({
          where: { id: existing.id },
          data: { isActive: true },
        });
        console.log(`✅ Reactivated: ${plan.name} (id: ${existing.id})`);
      } else {
        console.log(`✓  Already exists: ${plan.name} (id: ${existing.id})`);
      }
    } else {
      const created = await prisma.subscriptionPlan.create({
        data: {
          name: plan.name,
          description: plan.description,
          price: plan.price,
          duration: plan.duration,
          features: JSON.stringify(plan.features),
          isActive: true,
        },
      });
      console.log(`🆕 Created: ${plan.name} (id: ${created.id})`);
    }
  }

  // Step 3: Print summary
  const allPlans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
  });
  console.log('\n📊 All active plans:');
  for (const p of allPlans) {
    console.log(`   id: ${p.id} | ${p.name} | ₹${p.price} | ${p.duration} days`);
  }
  console.log(`\n✨ Total: ${allPlans.length} active plans`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
