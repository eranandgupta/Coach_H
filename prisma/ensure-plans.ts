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
    price: 1299,
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
    price: 2899,
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
    price: 4999,
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
    price: 9999,
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
    price: 2499,
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
    price: 3499,
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
    price: 8999,
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
    price: 17999,
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
  // Couple 1:1 plans — one shared account/login/dashboard for the couple; both
  // partners attend the same session slot together. Named "Elite 1:1 Couple ..." so
  // all Elite 1:1 logic (session tracking, live sessions, trainer assignment) applies.
  {
    name: 'Elite 1:1 Couple - 1 Month (12 Sessions)',
    description: 'For 2 People · One shared session slot',
    price: 12999,
    duration: 30,
    features: [
      'Live 1:1 coaching for both partners',
      'One shared slot — both attend the same session',
      'Personalised diet plan for each partner',
      '60 min per session',
      'Supplement guidance',
      'Lifestyle guidance',
      'WhatsApp support',
      'Full video library access',
      'Free Habit Tracker',
    ],
  },
  {
    name: 'Elite 1:1 Couple - 1 Month (24 Sessions)',
    description: 'For 2 People · One shared session slot',
    price: 19999,
    duration: 30,
    features: [
      'Live 1:1 coaching for both partners',
      'One shared slot — both attend the same session',
      'Personalised diet plan for each partner',
      '60 min per session',
      'Supplement guidance',
      'Lifestyle guidance',
      'WhatsApp support',
      'Full video library access',
      'Free Habit Tracker',
    ],
  },
  {
    name: 'Elite 1:1 Couple - 3 Months (36 Sessions)',
    description: 'For 2 People · One shared session slot',
    price: 30999,
    duration: 90,
    features: [
      'Live 1:1 coaching for both partners',
      'One shared slot — both attend the same session',
      'Personalised diet plan for each partner',
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
    name: 'Elite 1:1 Couple - 3 Months (72 Sessions)',
    description: 'For 2 People · One shared session slot',
    price: 47999,
    duration: 90,
    features: [
      'Live 1:1 coaching for both partners',
      'One shared slot — both attend the same session',
      'Personalised diet plan for each partner',
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
    name: 'Elite 1:1 - 1 Month (24 Sessions)',
    description: '24 Sessions',
    price: 12999,
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
    price: 7999,
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
    price: 31999,
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
    price: 19999,
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
    price: 4299,
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
    price: 5999,
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

  // Deactivate retired plans (Live Group Sessions). Deactivate rather than delete so
  // existing subscriptions keep their plan reference intact; inactive plans are hidden
  // from all listings (/api/plans and /api/subscriptions/plans filter on isActive).
  const retiredPlans = ['She Strong Program', 'Active Parents Program'];
  for (const name of retiredPlans) {
    const res = await prisma.subscriptionPlan.updateMany({
      where: { name, isActive: true },
      data: { isActive: false },
    });
    if (res.count > 0) console.log(`🗑️  Deactivated: ${name}`);
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
