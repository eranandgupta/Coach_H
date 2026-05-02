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
    price: 999,
    duration: 30,
    features: [
      'Customised workout plan',
      'Personalised diet plan',
      'Exercise video tutorial',
      'WhatsApp support',
      'Supplement guidance',
      'Lifestyle guidance',
      'One on one consultation weekly',
    ],
  },
  {
    name: 'Consistency Plan',
    description: 'All Inclusive',
    price: 2099,
    duration: 90,
    features: [
      'Customised workout plan',
      'Personalised diet plan',
      'Exercise video tutorial',
      'WhatsApp support',
      'Supplement guidance',
      'Lifestyle guidance',
      'One on one consultation weekly',
    ],
  },
  {
    name: 'Strength Plan',
    description: 'All Inclusive',
    price: 3599,
    duration: 180,
    features: [
      'Customised workout plan',
      'Personalised diet plan',
      'Exercise video tutorial',
      'WhatsApp support',
      'Supplement guidance',
      'Lifestyle guidance',
      'One on one consultation weekly',
    ],
  },
  {
    name: 'Mastery Plan',
    description: 'All Inclusive',
    price: 7499,
    duration: 365,
    features: [
      'Customised workout plan',
      'Personalised diet plan',
      'Exercise video tutorial',
      'WhatsApp support',
      'Supplement guidance',
      'Lifestyle guidance',
      'One on one consultation weekly',
    ],
  },
  {
    name: 'Home Workout',
    description: 'Home Workout',
    price: 1799,
    duration: 90,
    features: [
      'Customised home workout plan',
      'Personalised diet plan',
      'Exercise video tutorial',
      'WhatsApp support',
      'Supplement guidance',
      'Lifestyle guidance',
      'Resistance band & TRX band based workout (no gym equipment needed)',
      'One on one consultation twice a month',
    ],
  },
  {
    name: 'Rehabilitation Plan',
    description: 'Recovery & Healing',
    price: 2299,
    duration: 90,
    features: [
      'Customised rehabilitation workout',
      'Specially designed for knee, spine, elbow, shoulder, ankle joints',
      'No equipment needed',
      'WhatsApp support',
      'Exercise video tutorials',
      'Supplement guidance',
      'Lifestyle guidance',
      'One-on-one consultation twice a month',
    ],
  },
  {
    name: 'Couple Strength',
    description: 'For 2 People',
    price: 6999,
    duration: 180,
    features: [
      'Personalized workout plans for both',
      'Customized meal plans for both',
      'WhatsApp support',
      'Full video library access',
      'Weekly one-on-one consultations',
      'Supplement guidance',
      'Lifestyle coaching',
    ],
  },
  {
    name: 'Couple Mastery',
    description: 'For 2 People',
    price: 13899,
    duration: 365,
    features: [
      'Personalized workout plans for both',
      'Customized meal plans for both',
      'WhatsApp support',
      'Full video library access',
      'Weekly one-on-one consultations',
      'Supplement guidance',
      'Lifestyle coaching',
    ],
  },
  {
    name: 'She Strong Program',
    description: 'For Housewives Below 50',
    price: 999,
    duration: 30,
    features: [
      'Mon & Wed live classes (8 sessions/month)',
      '1 hour per session',
      'HIIT & bodyweight training',
      'Focus: fat loss, endurance & strength',
      'Heart & lungs health improvement',
      'No equipment needed',
      'Max 10 members per group',
      'Expert guidance by Coach Himanshu',
      'WhatsApp community support',
    ],
  },
  {
    name: 'Active Parents Program',
    description: 'For Adults 50+',
    price: 999,
    duration: 30,
    features: [
      'Tue & Thu live classes (8 sessions/month)',
      '1 hour per session',
      'Joint strengthening & flexibility',
      'Muscle strengthening exercises',
      'Balance & coordination training',
      'Mind-muscle connection focus',
      'Max 10 members per group',
      'Expert guidance by Coach Himanshu',
      'WhatsApp community support',
    ],
  },
  {
    name: 'Elite 1:1 - 1 Month (24 Sessions)',
    description: '24 Sessions',
    price: 9999,
    duration: 30,
    features: [
      'Live 1:1 personal training sessions',
      'Fully customised workout plan',
      'Personalised diet strategy',
      'Supplement & lifestyle guidance',
      'Real time form & technique correction',
      'Complete accountability system',
      'Dedicated WhatsApp support',
      '24 sessions in 30 days · 60 min each',
    ],
  },
  {
    name: 'Elite 1:1 - 1 Month (12 Sessions)',
    description: '12 Sessions',
    price: 5999,
    duration: 30,
    features: [
      'Live 1:1 personal training sessions',
      'Fully customised workout plan',
      'Personalised diet strategy',
      'Supplement & lifestyle guidance',
      'Real time form & technique correction',
      'Complete accountability system',
      'Dedicated WhatsApp support',
      '12 sessions in 30 days · 60 min each',
    ],
  },
  {
    name: 'Elite 1:1 - 3 Months (72 Sessions)',
    description: '72 Sessions',
    price: 23999,
    duration: 90,
    features: [
      'Live 1:1 personal training sessions',
      'Fully customised workout plan',
      'Personalised diet strategy',
      'Supplement & lifestyle guidance',
      'Real time form & technique correction',
      'Complete accountability system',
      'Dedicated WhatsApp support',
      '72 sessions in 90 days · 60 min each',
    ],
  },
  {
    name: 'Elite 1:1 - 3 Months (36 Sessions)',
    description: '36 Sessions',
    price: 15999,
    duration: 90,
    features: [
      'Live 1:1 personal training sessions',
      'Fully customised workout plan',
      'Personalised diet strategy',
      'Supplement & lifestyle guidance',
      'Real time form & technique correction',
      'Complete accountability system',
      'Dedicated WhatsApp support',
      '36 sessions in 90 days · 60 min each',
    ],
  },
  {
    name: 'Couple Home Workout Plan',
    description: 'For 2 People',
    price: 3099,
    duration: 90,
    features: [
      'Customised home workout plans for both',
      'Personalised diet plans for both',
      'Exercise video tutorials',
      'WhatsApp support',
      'Supplement guidance',
      'Lifestyle guidance',
      'Resistance band & TRX band based workout (no gym equipment needed)',
      'One on one consultation twice a month',
    ],
  },
  {
    name: 'Couple Rehabilitation Plan',
    description: 'For 2 People',
    price: 4099,
    duration: 90,
    features: [
      'Customised rehabilitation workouts for both',
      'Specially designed for knee, spine, elbow, shoulder, ankle joints',
      'No equipment needed',
      'WhatsApp support',
      'Exercise video tutorials',
      'Supplement guidance',
      'Lifestyle guidance',
      'One-on-one consultation twice a month',
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
