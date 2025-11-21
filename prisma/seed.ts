import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.meal.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.dietPlan.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.userSubscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const coach = await prisma.user.create({
    data: {
      email: 'coach@example.com',
      password: hashedPassword,
      name: 'Coach Himanshu',
      phone: '+91-9876543210',
      role: 'coach',
    },
  });
  console.log('✅ Coach created:', coach.email);

  const client = await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: hashedPassword,
      name: 'John Doe',
      phone: '+91-9876543211',
      role: 'user',
    },
  });
  console.log('✅ Client created:', client.email);

  // Create Subscription Plans
  console.log('💰 Creating subscription plans...');
  const basicPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Basic',
      description: 'Perfect for beginners starting their fitness journey',
      price: 999,
      duration: 30, // 30 days
      features: JSON.stringify([
        'Weekly workout plans',
        'Basic diet guidance',
        'Email support',
        'Progress tracking',
      ]),
      isActive: true,
    },
  });

  const proPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Pro',
      description: 'For serious athletes looking to level up',
      price: 2499,
      duration: 90, // 90 days
      features: JSON.stringify([
        'Customized workout plans',
        'Detailed meal plans',
        'Priority support',
        'Weekly check-ins',
        'Progress tracking',
        'Video consultations',
      ]),
      isActive: true,
    },
  });

  const premiumPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Premium',
      description: 'Ultimate transformation package with premium support',
      price: 7999,
      duration: 365, // 365 days
      features: JSON.stringify([
        'Fully customized workout & diet plans',
        '24/7 priority support',
        'Bi-weekly video calls',
        'Supplement guidance',
        'Progress tracking & analytics',
        'Exclusive content access',
        'Free merchandise',
      ]),
      isActive: true,
    },
  });
  console.log('✅ Subscription plans created');

  // Create Active Subscription for Client
  console.log('📝 Creating subscription for client...');
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + proPlan.duration);

  const subscription = await prisma.userSubscription.create({
    data: {
      userId: client.id,
      planId: proPlan.id,
      status: 'active',
      startDate,
      endDate,
    },
  });
  console.log('✅ Active Pro subscription created for client');

  // Create Workout Plan with Exercises
  console.log('💪 Creating workout plan...');
  const workoutStartDate = new Date();
  const workoutEndDate = new Date();
  workoutEndDate.setDate(workoutEndDate.getDate() + 7);

  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      title: 'Week 1 - Full Body Strength',
      description: 'A comprehensive full-body workout plan to build strength and muscle mass',
      clientId: client.id,
      coachId: coach.id,
      weekNumber: 1,
      startDate: workoutStartDate,
      endDate: workoutEndDate,
      notes: 'Focus on form over weight. Rest 2-3 minutes between sets. Stay hydrated!',
      exercises: {
        create: [
          // Monday - Upper Body
          {
            name: 'Barbell Bench Press',
            description: 'Lie on bench, lower bar to chest, press up explosively',
            sets: 4,
            reps: '8-10',
            restTime: 120,
            day: 'Monday',
            order: 1,
          },
          {
            name: 'Bent Over Barbell Rows',
            description: 'Hinge at hips, pull bar to lower chest, squeeze shoulder blades',
            sets: 4,
            reps: '8-10',
            restTime: 120,
            day: 'Monday',
            order: 2,
          },
          {
            name: 'Overhead Press',
            description: 'Press barbell overhead, lock out at top',
            sets: 3,
            reps: '10-12',
            restTime: 90,
            day: 'Monday',
            order: 3,
          },
          {
            name: 'Pull-ups',
            description: 'Hang from bar, pull until chin over bar',
            sets: 3,
            reps: '8-12',
            restTime: 90,
            day: 'Monday',
            order: 4,
          },
          // Wednesday - Lower Body
          {
            name: 'Barbell Squats',
            description: 'Squat down until thighs parallel, drive through heels',
            sets: 4,
            reps: '8-10',
            restTime: 180,
            day: 'Wednesday',
            order: 1,
          },
          {
            name: 'Romanian Deadlifts',
            description: 'Hinge at hips, lower bar along shins, feel hamstring stretch',
            sets: 4,
            reps: '10-12',
            restTime: 120,
            day: 'Wednesday',
            order: 2,
          },
          {
            name: 'Leg Press',
            description: 'Push platform away, control the descent',
            sets: 3,
            reps: '12-15',
            restTime: 90,
            day: 'Wednesday',
            order: 3,
          },
          {
            name: 'Calf Raises',
            description: 'Raise up on toes, hold at top, lower slowly',
            sets: 4,
            reps: '15-20',
            restTime: 60,
            day: 'Wednesday',
            order: 4,
          },
          // Friday - Full Body
          {
            name: 'Deadlifts',
            description: 'Pull bar from floor, keep back straight, drive hips forward',
            sets: 4,
            reps: '6-8',
            restTime: 180,
            day: 'Friday',
            order: 1,
          },
          {
            name: 'Incline Dumbbell Press',
            description: 'Press dumbbells on incline bench, control the descent',
            sets: 3,
            reps: '10-12',
            restTime: 90,
            day: 'Friday',
            order: 2,
          },
          {
            name: 'Lat Pulldowns',
            description: 'Pull bar to upper chest, squeeze lats',
            sets: 3,
            reps: '12-15',
            restTime: 90,
            day: 'Friday',
            order: 3,
          },
          {
            name: 'Plank',
            description: 'Hold plank position, keep core tight',
            sets: 3,
            duration: 1, // 1 minute
            restTime: 60,
            day: 'Friday',
            order: 4,
          },
        ],
      },
    },
  });
  console.log('✅ Workout plan created with 12 exercises');

  // Create Diet Plan with Meals
  console.log('🥗 Creating diet plan...');
  const dietPlan = await prisma.dietPlan.create({
    data: {
      title: 'Week 1 - High Protein Muscle Building',
      description: 'A balanced high-protein diet to support muscle growth and recovery',
      clientId: client.id,
      coachId: coach.id,
      weekNumber: 1,
      startDate: workoutStartDate,
      endDate: workoutEndDate,
      targetCalories: 2500,
      notes: 'Drink at least 3-4 liters of water daily. Take protein shake post-workout.',
      meals: {
        create: [
          // Monday
          {
            name: 'Oatmeal with Protein',
            description: 'Protein-packed breakfast to start your day',
            mealType: 'Breakfast',
            calories: 450,
            protein: 35,
            carbs: 55,
            fats: 12,
            ingredients: '1 cup oats, 1 scoop whey protein, 1 banana, 10 almonds, honey',
            instructions: 'Cook oats with water/milk. Mix in protein powder. Top with sliced banana and almonds.',
            day: 'Monday',
            time: '08:00',
            order: 1,
          },
          {
            name: 'Grilled Chicken Salad',
            description: 'Light and protein-rich lunch',
            mealType: 'Lunch',
            calories: 550,
            protein: 45,
            carbs: 40,
            fats: 18,
            ingredients: '200g chicken breast, mixed greens, cherry tomatoes, cucumber, olive oil, lemon',
            instructions: 'Grill chicken. Toss salad with vegetables. Dress with olive oil and lemon.',
            day: 'Monday',
            time: '13:00',
            order: 2,
          },
          {
            name: 'Post-Workout Shake',
            description: 'Quick protein and carbs post-workout',
            mealType: 'Evening Snack',
            calories: 350,
            protein: 40,
            carbs: 35,
            fats: 5,
            ingredients: '1.5 scoops whey protein, 1 banana, 200ml milk',
            instructions: 'Blend all ingredients until smooth. Consume within 30 minutes of workout.',
            day: 'Monday',
            time: '18:00',
            order: 3,
          },
          {
            name: 'Salmon with Sweet Potato',
            description: 'Omega-3 rich dinner for recovery',
            mealType: 'Dinner',
            calories: 650,
            protein: 50,
            carbs: 55,
            fats: 22,
            ingredients: '200g salmon fillet, 1 large sweet potato, broccoli, butter',
            instructions: 'Bake salmon at 180°C for 15 mins. Roast sweet potato. Steam broccoli.',
            day: 'Monday',
            time: '20:00',
            order: 4,
          },
          // Tuesday
          {
            name: 'Scrambled Eggs & Toast',
            description: 'Classic protein breakfast',
            mealType: 'Breakfast',
            calories: 420,
            protein: 32,
            carbs: 45,
            fats: 15,
            ingredients: '4 whole eggs, 2 slices whole wheat bread, butter, spinach',
            instructions: 'Scramble eggs with spinach. Toast bread. Serve together.',
            day: 'Tuesday',
            time: '08:00',
            order: 1,
          },
          {
            name: 'Brown Rice & Chicken',
            description: 'Balanced meal with complete protein',
            mealType: 'Lunch',
            calories: 600,
            protein: 48,
            carbs: 60,
            fats: 12,
            ingredients: '1 cup brown rice, 200g chicken breast, mixed vegetables',
            instructions: 'Cook rice. Grill or bake chicken. Stir-fry vegetables.',
            day: 'Tuesday',
            time: '13:00',
            order: 2,
          },
          {
            name: 'Greek Yogurt with Berries',
            description: 'Protein-rich snack',
            mealType: 'Evening Snack',
            calories: 280,
            protein: 25,
            carbs: 30,
            fats: 8,
            ingredients: '200g Greek yogurt, mixed berries, honey',
            instructions: 'Mix yogurt with berries. Drizzle honey on top.',
            day: 'Tuesday',
            time: '17:00',
            order: 3,
          },
          {
            name: 'Lean Beef Stir-fry',
            description: 'Iron and protein-packed dinner',
            mealType: 'Dinner',
            calories: 580,
            protein: 52,
            carbs: 48,
            fats: 18,
            ingredients: '200g lean beef, bell peppers, onions, soy sauce, brown rice',
            instructions: 'Stir-fry beef with vegetables. Season with soy sauce. Serve with rice.',
            day: 'Tuesday',
            time: '20:00',
            order: 4,
          },
          // Wednesday
          {
            name: 'Protein Pancakes',
            description: 'Delicious high-protein breakfast',
            mealType: 'Breakfast',
            calories: 480,
            protein: 38,
            carbs: 52,
            fats: 14,
            ingredients: '1 scoop protein powder, 2 eggs, 1 banana, oats, maple syrup',
            instructions: 'Blend ingredients. Cook pancakes on griddle. Top with syrup.',
            day: 'Wednesday',
            time: '08:00',
            order: 1,
          },
          {
            name: 'Tuna Sandwich',
            description: 'Quick and easy protein lunch',
            mealType: 'Lunch',
            calories: 520,
            protein: 42,
            carbs: 48,
            fats: 16,
            ingredients: '1 can tuna, 2 slices whole wheat bread, lettuce, tomato, mayo',
            instructions: 'Mix tuna with mayo. Build sandwich with vegetables.',
            day: 'Wednesday',
            time: '13:00',
            order: 2,
          },
          {
            name: 'Protein Bar & Apple',
            description: 'Convenient pre-workout snack',
            mealType: 'Evening Snack',
            calories: 320,
            protein: 25,
            carbs: 38,
            fats: 8,
            ingredients: '1 protein bar (20g+ protein), 1 medium apple',
            instructions: 'Eat protein bar and apple 30-45 minutes before workout.',
            day: 'Wednesday',
            time: '17:00',
            order: 3,
          },
          {
            name: 'Grilled Turkey & Quinoa',
            description: 'Lean protein with complete amino acids',
            mealType: 'Dinner',
            calories: 590,
            protein: 50,
            carbs: 52,
            fats: 15,
            ingredients: '200g turkey breast, 1 cup quinoa, asparagus, olive oil',
            instructions: 'Grill turkey. Cook quinoa. Roast asparagus with olive oil.',
            day: 'Wednesday',
            time: '20:00',
            order: 4,
          },
        ],
      },
    },
  });
  console.log('✅ Diet plan created with 12 meals');

  console.log('\n✨ Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log('- Users: 2 (1 coach, 1 client)');
  console.log('- Subscription Plans: 3');
  console.log('- Active Subscriptions: 1');
  console.log('- Workout Plans: 1 (with 12 exercises)');
  console.log('- Diet Plans: 1 (with 12 meals)\n');
  console.log('🔑 Login Credentials:');
  console.log('Coach: coach@example.com / password123');
  console.log('Client: client@example.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
