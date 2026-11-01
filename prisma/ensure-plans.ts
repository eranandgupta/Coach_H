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
import { PLAN_PRICES } from '../lib/pricing';

const prisma = new PrismaClient();

const requiredPlans = [
  {
    name: 'Kickstart Plan',
    description: 'All Inclusive',
    price: PLAN_PRICES['Kickstart Plan'].price,
    duration: PLAN_PRICES['Kickstart Plan'].durationDays,
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
    price: PLAN_PRICES['Consistency Plan'].price,
    duration: PLAN_PRICES['Consistency Plan'].durationDays,
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
    price: PLAN_PRICES['Strength Plan'].price,
    duration: PLAN_PRICES['Strength Plan'].durationDays,
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
    price: PLAN_PRICES['Mastery Plan'].price,
    duration: PLAN_PRICES['Mastery Plan'].durationDays,
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
    price: PLAN_PRICES['Home Workout'].price,
    duration: PLAN_PRICES['Home Workout'].durationDays,
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
    price: PLAN_PRICES['Rehabilitation Plan'].price,
    duration: PLAN_PRICES['Rehabilitation Plan'].durationDays,
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
    price: PLAN_PRICES['Couple Strength'].price,
    duration: PLAN_PRICES['Couple Strength'].durationDays,
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
    price: PLAN_PRICES['Couple Mastery'].price,
    duration: PLAN_PRICES['Couple Mastery'].durationDays,
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
    price: PLAN_PRICES['Elite 1:1 Couple - 1 Month (12 Sessions)'].price,
    duration: PLAN_PRICES['Elite 1:1 Couple - 1 Month (12 Sessions)'].durationDays,
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
    price: PLAN_PRICES['Elite 1:1 Couple - 1 Month (24 Sessions)'].price,
    duration: PLAN_PRICES['Elite 1:1 Couple - 1 Month (24 Sessions)'].durationDays,
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
    price: PLAN_PRICES['Elite 1:1 Couple - 3 Months (36 Sessions)'].price,
    duration: PLAN_PRICES['Elite 1:1 Couple - 3 Months (36 Sessions)'].durationDays,
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
    price: PLAN_PRICES['Elite 1:1 Couple - 3 Months (72 Sessions)'].price,
    duration: PLAN_PRICES['Elite 1:1 Couple - 3 Months (72 Sessions)'].durationDays,
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
    price: PLAN_PRICES['Elite 1:1 - 1 Month (24 Sessions)'].price,
    duration: PLAN_PRICES['Elite 1:1 - 1 Month (24 Sessions)'].durationDays,
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
    price: PLAN_PRICES['Elite 1:1 - 1 Month (12 Sessions)'].price,
    duration: PLAN_PRICES['Elite 1:1 - 1 Month (12 Sessions)'].durationDays,
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
    price: PLAN_PRICES['Elite 1:1 - 3 Months (72 Sessions)'].price,
    duration: PLAN_PRICES['Elite 1:1 - 3 Months (72 Sessions)'].durationDays,
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
    price: PLAN_PRICES['Elite 1:1 - 3 Months (36 Sessions)'].price,
    duration: PLAN_PRICES['Elite 1:1 - 3 Months (36 Sessions)'].durationDays,
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
    price: PLAN_PRICES['Couple Home Workout Plan'].price,
    duration: PLAN_PRICES['Couple Home Workout Plan'].durationDays,
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
    price: PLAN_PRICES['Couple Rehabilitation Plan'].price,
    duration: PLAN_PRICES['Couple Rehabilitation Plan'].durationDays,
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
