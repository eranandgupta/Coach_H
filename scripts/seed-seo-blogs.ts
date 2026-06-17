import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const posts = [
  {
    title: 'Top 10 Home Workout Exercises for Beginners in India',
    slug: 'top-10-home-workout-exercises-for-beginners-in-india',
    excerpt: 'Discover the best home workout exercises for beginners in India. No equipment needed -- build strength, burn fat, and stay fit from your living room.',
    readTime: 8,
    content: `<p>Starting a fitness journey does not require an expensive gym membership or fancy equipment. Millions of people across India are discovering the power of a solid <strong>home workout</strong> routine that delivers real results. Whether you live in a compact apartment in Mumbai or a house in Chandigarh, these exercises need nothing more than your body weight and a small patch of floor space.</p>

<p>As a NASM Certified fitness coach, I have helped hundreds of clients across India build impressive physiques and transform their health -- many of them training entirely from home. In this guide, I will walk you through the <strong>top 10 home workout exercises</strong> that are perfect for beginners, with exact sets, reps, and technique cues so you can start today.</p>

<h2>Why Home Workouts Work So Well in India</h2>

<p>India presents unique challenges for fitness enthusiasts. Gym timings may clash with long commutes, monsoon season makes outdoor exercise unpredictable, and air quality in many cities can make running outdoors a health risk during certain months. A well-structured home workout eliminates all of these barriers.</p>

<p>Home workouts also save money. A decent gym membership in a metro city can cost anywhere from Rs 2,000 to Rs 10,000 per month. With bodyweight training, that investment is zero -- and you can train at any hour that suits your schedule.</p>

<p>The key is not where you train -- it is how you train. Progressive overload, proper form, and consistency matter far more than having access to machines. Let us get into the exercises.</p>

<h2>The Top 10 Home Workout Exercises for Beginners</h2>

<h3>1. Bodyweight Squats</h3>
<p><strong>Target muscles:</strong> Quadriceps, glutes, hamstrings, core</p>
<p>The squat is the king of lower body exercises. Stand with feet shoulder-width apart, toes slightly turned out. Push your hips back as if sitting into a chair. Lower until your thighs are parallel to the floor. Keep your chest up and knees tracking over your toes. Drive through your heels to stand back up.</p>
<p><strong>Beginner prescription:</strong> 3 sets of 15 reps. Rest 60 seconds between sets.</p>

<h3>2. Push-Ups (Modified if Needed)</h3>
<p><strong>Target muscles:</strong> Chest, shoulders, triceps, core</p>
<p>Start in a high plank position -- hands slightly wider than shoulder-width, body in a straight line. Lower your chest toward the floor by bending your elbows. Push back up. If too challenging, drop your knees to the floor.</p>
<p><strong>Beginner prescription:</strong> 3 sets of 8-12 reps. Rest 60 seconds between sets.</p>

<h3>3. Lunges (Forward or Reverse)</h3>
<p><strong>Target muscles:</strong> Quadriceps, glutes, hamstrings, hip stabilizers</p>
<p>Stand tall. Step one foot forward about 2-3 feet and lower your back knee toward the floor. Both knees should bend to roughly 90 degrees. Push through the front heel to return to standing.</p>
<p><strong>Beginner prescription:</strong> 3 sets of 10 reps per leg. Rest 60 seconds between sets.</p>

<h3>4. Plank Hold</h3>
<p><strong>Target muscles:</strong> Entire core</p>
<p>Get into a forearm plank position. Elbows directly under your shoulders, body in a perfectly straight line. Squeeze your glutes and brace your core. Do not let your hips sag or pike up.</p>
<p><strong>Beginner prescription:</strong> 3 sets, hold for 20-30 seconds. Rest 45 seconds between sets.</p>

<h3>5. Glute Bridges</h3>
<p><strong>Target muscles:</strong> Glutes, hamstrings, lower back</p>
<p>Lie on your back with knees bent and feet flat on the floor. Press through your heels and squeeze your glutes to lift your hips toward the ceiling. Hold for 2 seconds, then lower slowly.</p>
<p><strong>Beginner prescription:</strong> 3 sets of 15 reps. Rest 45 seconds between sets.</p>

<h3>6. Mountain Climbers</h3>
<p><strong>Target muscles:</strong> Core, hip flexors, shoulders, cardiovascular system</p>
<p>Start in a high plank position. Drive one knee toward your chest, then quickly switch legs. Keep your hips level and core tight throughout.</p>
<p><strong>Beginner prescription:</strong> 3 sets of 20 total reps (10 per side). Rest 60 seconds between sets.</p>

<h3>7. Superman Hold</h3>
<p><strong>Target muscles:</strong> Lower back, glutes, upper back</p>
<p>Lie face down with arms extended overhead. Simultaneously lift your arms, chest, and legs off the floor. Hold for 2-3 seconds at the top, then lower with control.</p>
<p><strong>Beginner prescription:</strong> 3 sets of 10 reps with a 2-second hold. Rest 45 seconds between sets.</p>

<h3>8. Jumping Jacks</h3>
<p><strong>Target muscles:</strong> Full body cardiovascular exercise</p>
<p>Stand with feet together and arms at your sides. Jump your feet out wide while raising your arms overhead. Jump back to the starting position.</p>
<p><strong>Beginner prescription:</strong> 3 sets of 30 seconds. Rest 30 seconds between sets.</p>

<h3>9. Tricep Dips (Using a Chair)</h3>
<p><strong>Target muscles:</strong> Triceps, shoulders, chest</p>
<p>Sit on the edge of a sturdy chair. Place your hands next to your hips gripping the edge. Walk your feet out and slide your hips off the chair. Lower your body by bending your elbows to about 90 degrees. Push back up.</p>
<p><strong>Beginner prescription:</strong> 3 sets of 8-10 reps. Rest 60 seconds between sets.</p>

<h3>10. High Knees</h3>
<p><strong>Target muscles:</strong> Hip flexors, core, cardiovascular system</p>
<p>Stand tall. Run in place, driving your knees up to hip height with each step. Pump your arms in rhythm with your legs.</p>
<p><strong>Beginner prescription:</strong> 3 sets of 20 seconds. Rest 30 seconds between sets.</p>

<h2>The Complete Beginner Home Workout Routine</h2>
<p><strong>Warm-Up (5 minutes):</strong></p>
<ul>
<li>Jumping Jacks -- 2 sets of 30 seconds</li>
<li>High Knees -- 2 sets of 20 seconds</li>
<li>Arm circles and hip rotations -- 1 minute</li>
</ul>
<p><strong>Main Workout (25-30 minutes):</strong></p>
<ul>
<li>Bodyweight Squats -- 3 x 15</li>
<li>Push-Ups -- 3 x 8-12</li>
<li>Lunges -- 3 x 10 per leg</li>
<li>Plank Hold -- 3 x 20-30 seconds</li>
<li>Glute Bridges -- 3 x 15</li>
<li>Mountain Climbers -- 3 x 20 total</li>
<li>Superman Hold -- 3 x 10</li>
<li>Tricep Dips -- 3 x 8-10</li>
</ul>

<h2>Common Mistakes Beginners Make</h2>
<p><strong>Skipping the warm-up:</strong> Your muscles and joints need preparation. Always spend 5 minutes warming up.</p>
<p><strong>Prioritizing speed over form:</strong> Doing 50 sloppy push-ups is worse than doing 10 perfect ones.</p>
<p><strong>Training every single day:</strong> Your muscles grow during rest. Take at least 2-3 rest days per week.</p>
<p><strong>Ignoring nutrition:</strong> Exercise is only half the equation. Pair your home workout with a balanced diet rich in protein and whole foods.</p>

<h2>When Should You Consider Getting a Coach?</h2>
<p>If you have been training for a few weeks and want a structured plan tailored to your body, goals, and schedule, working with a certified fitness coach can accelerate your results dramatically. Coach Himanshu has helped clients across India build custom home workout programs that deliver measurable progress.</p>
<p>Ready to take your home workouts to the next level? <a href="/assessment">Take the free fitness assessment</a> to get started, or <a href="/#plans">explore the training plans</a> available.</p>

<h2>Final Thoughts</h2>
<p>A home workout in India is not a compromise -- it is a smart, sustainable approach to fitness. These 10 exercises cover your entire body, require zero equipment, and can be done in under 40 minutes. Start with 3 sessions per week, focus on proper form, and progressively challenge yourself.</p>`,
  },
  {
    title: 'Why You Need a NASM Certified Fitness Coach',
    slug: 'why-you-need-a-nasm-certified-fitness-coach',
    excerpt: 'Learn why a NASM certified fitness coach makes a real difference. Understand the science-backed training approach that sets NASM coaches apart in India.',
    readTime: 7,
    content: `<p>The fitness industry in India is booming. Social media is flooded with workout advice, transformation reels, and self-proclaimed fitness experts. But here is the uncomfortable truth: most people giving fitness advice in India have zero formal education in exercise science.</p>

<p>This is where <strong>NASM certification</strong> stands apart. The National Academy of Sports Medicine is one of the most respected fitness education institutions in the world, and working with a NASM certified fitness coach can be the difference between spinning your wheels for years and actually achieving the body and health you want.</p>

<h2>What Exactly Is NASM Certification?</h2>
<p>NASM stands for the <strong>National Academy of Sports Medicine</strong>, headquartered in the United States. To earn a NASM Certified Personal Trainer (NASM-CPT) credential, a professional must complete a rigorous academic curriculum covering anatomy, physiology, kinesiology, biomechanics, and program design, then pass a comprehensive proctored examination.</p>

<h2>Why NASM Certification Matters for Your Results</h2>

<h3>1. Science-Based Program Design</h3>
<p>A NASM certified coach uses the <strong>OPT Model (Optimum Performance Training)</strong>, a progressive, periodized system that takes you through specific phases: Stabilization Endurance, Strength Endurance, Muscular Development, Maximal Strength, and Power. Each phase builds on the previous one. Compare this to the typical Indian gym experience where every new member gets the same generic split.</p>

<h3>2. Injury Prevention Through Corrective Exercise</h3>
<p>Before designing your workout, a NASM coach performs movement assessments to identify muscle imbalances, postural deviations, and movement compensations. This is critically important in India where many clients come from sedentary desk jobs in the IT and corporate sectors.</p>

<h3>3. Understanding Individual Differences</h3>
<p>A NASM certified coach understands that your age, body composition, injury history, medical conditions, stress levels, and lifestyle all affect how your program should be designed. A 35-year-old software developer with lower back pain needs a fundamentally different approach than a 22-year-old college student who wants to build muscle.</p>

<h3>4. Nutrition Guidance Grounded in Science</h3>
<p>In India, where diet myths are rampant (avoid rice to lose weight, eat only salads, skip dinner for fat loss), having a coach who understands actual nutrition science is invaluable. They will help you work with the foods you love -- dal, roti, rice, paneer -- while still hitting your nutritional targets.</p>

<h2>The Problem With Uncertified Trainers in India</h2>
<p>The barrier to becoming a personal trainer in most Indian gyms is alarmingly low. The consequences are real: injuries from improper form coaching, cookie-cutter programs, dangerous dietary advice, no progression system, and zero accountability.</p>

<h2>What to Expect From a NASM Certified Coach</h2>
<p><strong>Step 1 -- Comprehensive Assessment:</strong> Posture, movement patterns, fitness level, body composition, medical history.</p>
<p><strong>Step 2 -- Goal Setting:</strong> Clear, measurable, time-bound goals.</p>
<p><strong>Step 3 -- Customized Program Design:</strong> Periodized training using the OPT model.</p>
<p><strong>Step 4 -- Ongoing Monitoring:</strong> Regular progress tracking and program adjustments.</p>
<p><strong>Step 5 -- Education:</strong> Teaching you why, not just what.</p>

<h2>How Coach Himanshu Applies NASM Principles</h2>
<p>Coach Himanshu is a NASM Certified fitness professional who brings international-standard training methodology to clients across India. Every client begins with a thorough <a href="/assessment">fitness assessment</a>. Programs are built using evidence-based protocols, tailored to each individual's starting point and target outcomes.</p>
<p>Explore the <a href="/#plans">training plans</a> to see how structured coaching can transform your fitness results.</p>

<h2>The Bottom Line</h2>
<p>In a country where the fitness industry is largely unregulated, choosing a NASM certified fitness coach is one of the smartest investments you can make in your health. Your body deserves to be trained by someone who truly understands how it works.</p>
<p>Ready to experience the difference? <a href="/assessment">Start with a free fitness assessment</a> and take the first step toward training that actually works.</p>`,
  },
  {
    title: 'Best Diet Plan for Muscle Building in India',
    slug: 'best-diet-plan-for-muscle-building-in-india',
    excerpt: 'The ultimate Indian diet plan for muscle building. Includes vegetarian and non-veg meal plans using everyday Indian foods like dal, paneer, and chicken.',
    readTime: 8,
    content: `<p>Most muscle-building diet plans floating around the internet are designed for Western audiences. The good news? Indian cuisine is incredibly well-suited for muscle building. You do not need to abandon your dal-chawal or paneer tikka. You need to structure it properly.</p>

<h2>The Science of Eating for Muscle Growth</h2>

<h3>1. Caloric Surplus</h3>
<p>To build muscle, you must consume more calories than your body burns. A surplus of 300-500 calories above your maintenance level is the sweet spot for lean muscle gain.</p>

<h3>2. Adequate Protein Intake</h3>
<p>Aim for <strong>1.6 to 2.2 grams of protein per kilogram of body weight</strong> per day. A 70 kg person needs roughly 112-154 grams of protein daily. This is where many Indians fall short -- traditional meals tend to be carbohydrate-heavy.</p>

<h3>3. Strategic Carbohydrate and Fat Balance</h3>
<p>A good split: approximately 40% carbohydrates, 30% protein, and 30% fats.</p>

<h2>Top Indian Foods for Muscle Building</h2>

<h3>High-Protein Indian Foods</h3>
<ul>
<li><strong>Paneer:</strong> 18g protein per 100g</li>
<li><strong>Chicken breast:</strong> 31g protein per 100g</li>
<li><strong>Eggs:</strong> 13g protein per 2 eggs</li>
<li><strong>Moong dal:</strong> 24g protein per 100g (dry)</li>
<li><strong>Chana:</strong> 19g protein per 100g (dry)</li>
<li><strong>Soya chunks:</strong> 52g protein per 100g (dry)</li>
<li><strong>Fish (rohu, surmai):</strong> 20-25g protein per 100g</li>
</ul>

<h2>Sample Vegetarian Muscle-Building Meal Plan</h2>
<p><strong>Target: ~2,500 calories | 130g protein</strong></p>
<ul>
<li><strong>7 AM:</strong> Oats with milk + banana + 10 almonds (~450 cal, 18g protein)</li>
<li><strong>10 AM:</strong> Paneer bhurji (150g) + 2 toast + buttermilk (~480 cal, 30g protein)</li>
<li><strong>1 PM:</strong> 2 roti + rajma curry + rice + curd (~650 cal, 28g protein)</li>
<li><strong>4:30 PM:</strong> Peanut butter + apple or soya chaat (~300 cal, 15g protein)</li>
<li><strong>8 PM:</strong> Chana dal + 2 roti + palak paneer + rice (~620 cal, 35g protein)</li>
</ul>

<h2>Sample Non-Vegetarian Meal Plan</h2>
<p><strong>Target: ~2,600 calories | 160g protein</strong></p>
<ul>
<li><strong>7 AM:</strong> 3 eggs + 2 egg whites + bread + banana (~480 cal, 28g protein)</li>
<li><strong>10 AM:</strong> Chicken tikka (150g) + paratha (~420 cal, 38g protein)</li>
<li><strong>1 PM:</strong> Chicken curry + 2 roti + rice + moong dal (~700 cal, 45g protein)</li>
<li><strong>4:30 PM:</strong> Poha with peanuts + 1 boiled egg (~350 cal, 14g protein)</li>
<li><strong>8 PM:</strong> Grilled fish + 2 roti + dal tadka + sabzi (~650 cal, 40g protein)</li>
</ul>

<h2>Budget-Friendly Tips</h2>
<ul>
<li><strong>Eggs:</strong> ~Rs 6-8 per egg, cheapest high-quality protein</li>
<li><strong>Soya chunks:</strong> Rs 100/kg provides 500g+ protein</li>
<li><strong>Buy dal in bulk:</strong> Wholesale markets for best prices</li>
<li><strong>Peanuts over almonds:</strong> Nearly as nutritious at a fraction of the cost</li>
<li><strong>Make curd at home:</strong> Cheaper and fresher than store-bought</li>
</ul>

<h2>Common Diet Mistakes</h2>
<p><strong>Too little protein at breakfast:</strong> Add eggs, paneer, or milk to your morning meal.</p>
<p><strong>Avoiding rice completely:</strong> Rice fuels your workouts. Control portions, do not eliminate.</p>
<p><strong>Extreme weekday dieting, weekend overeating:</strong> Consistency across all 7 days matters.</p>

<h2>When to Adjust Your Plan</h2>
<p>Coach Himanshu provides personalized diet guidance as part of his training plans, taking into account your food preferences, budget, and goals. <a href="/assessment">Take the fitness assessment</a> to get a plan designed specifically for you.</p>

<h2>Final Thoughts</h2>
<p>Building muscle on an Indian diet is not just possible -- it is practical, affordable, and delicious. Dal, paneer, eggs, chicken, rice, roti, and ghee -- the foods your family has been cooking for generations -- are everything you need. Structure them properly, train hard, and the results will come.</p>`,
  },
  {
    title: 'How Online Fitness Coaching Works - Complete Guide',
    slug: 'how-online-fitness-coaching-works-complete-guide',
    excerpt: 'Everything you need to know about online fitness coaching. How it works, what to expect, common doubts answered, and how to pick the right coach.',
    readTime: 7,
    content: `<p><strong>Online fitness coaching</strong> is one of the fastest-growing segments of the health and wellness industry. It combines expert guidance with the flexibility modern life demands. This guide walks you through exactly what the online coaching experience looks like.</p>

<h2>What Is Online Fitness Coaching?</h2>
<p>Online fitness coaching is a professional service where a certified fitness coach designs, delivers, and monitors your training and nutrition program remotely. This is <strong>not</strong> the same as buying a generic PDF workout plan. True online coaching is personalized, interactive, and adaptive.</p>

<h2>How It Works: Step by Step</h2>

<h3>Step 1: Initial Assessment</h3>
<p>Every serious program begins with a comprehensive assessment covering health history, current fitness level, body measurements, lifestyle factors, dietary preferences, and goals.</p>

<h3>Step 2: Custom Program Design</h3>
<p>Your coach designs a tailored workout plan and nutrition framework based on your assessment. For Indian clients, nutrition is built around foods you actually eat -- dal, roti, rice, and regional dishes.</p>

<h3>Step 3: Program Delivery</h3>
<p>Your program is delivered through a digital platform where you can access workouts, log sessions, and communicate with your coach. Video demonstrations show proper form for every exercise.</p>

<h3>Step 4: Ongoing Support</h3>
<p>You have direct access to your coach through messaging. Send videos for form review, ask questions about exercise substitutions, or get adjustments when traveling.</p>

<h3>Step 5: Progress Tracking</h3>
<p>Your coach monitors body weight trends, strength progression, visual progress, energy levels, and adherence. Based on this data, your program is adjusted regularly.</p>

<h2>Advantages of Online Coaching</h2>

<h3>Train Anywhere, Anytime</h3>
<p>Whether you train in a gym in Delhi, at home in Pune, or a hotel room while traveling -- your program follows you everywhere. For Indian professionals with unpredictable schedules, this is a game-changer.</p>

<h3>Access to Better Coaches</h3>
<p>A client in a tier-2 city can access the same quality of coaching as someone in a metro. Geography no longer limits who you can work with.</p>

<h3>More Affordable</h3>
<p>In-person personal training in Indian metros costs Rs 3,000-8,000/month for 12-16 sessions. Online coaching costs less while providing daily access, comprehensive programming, and nutrition guidance.</p>

<h3>Better Accountability</h3>
<p>Logging workouts, submitting progress photos, and regular check-ins create a consistent structure that keeps you on track.</p>

<h2>Common Doubts Answered</h2>

<p><strong>"How will my coach correct my form?"</strong> Video form checks. Record yourself and send to your coach for detailed feedback.</p>

<p><strong>"I am a complete beginner. Is this for me?"</strong> Absolutely. Beginners benefit the most from expert guidance from day one.</p>

<p><strong>"I do not have a gym. Can it work?"</strong> Yes. Effective programs can be designed for home workouts and bodyweight training.</p>

<p><strong>"Will I get the same results?"</strong> Research shows online coaching produces comparable results when the program is well-designed and you are committed.</p>

<h2>How to Choose the Right Coach</h2>
<ul>
<li><strong>Legitimate certification:</strong> NASM, ACE, ISSA, or NSCA</li>
<li><strong>Experience with similar clients</strong></li>
<li><strong>Transparent process and realistic expectations</strong></li>
<li><strong>Responsive communication</strong></li>
<li><strong>Genuine client testimonials</strong></li>
</ul>

<h2>How Online Coaching Works With Coach Himanshu</h2>
<p>Coach Himanshu's program starts with a detailed <a href="/assessment">fitness assessment</a>. You receive a fully customized workout plan, nutrition framework built around Indian foods, and ongoing support through direct messaging. Programs work whether you train at a gym, at home, or both.</p>
<p>Explore the <a href="/#plans">training plans</a> to find the right fit for your goals.</p>

<h2>Getting Started</h2>
<p>The barrier to starting is low. You do not need to be "fit enough" to begin -- that is the whole point of coaching. <a href="/assessment">Complete your fitness assessment today</a> and take the first step toward structured, science-backed training that fits your life.</p>`,
  },
];

async function main() {
  const coach = await prisma.user.findFirst({
    where: { role: 'coach' },
  });

  if (!coach) {
    console.log('No coach user found. Please create a coach user first.');
    return;
  }

  console.log(`Using coach: ${coach.name || coach.email} (ID: ${coach.id})`);

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });

    if (existing) {
      console.log(`Skipping "${post.title}" -- already exists`);
      continue;
    }

    const created = await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        readTime: post.readTime,
        authorId: coach.id,
        published: true,
        publishedAt: new Date(),
      },
    });

    console.log(`Created: "${created.title}" (ID: ${created.id})`);
  }

  console.log('\nDone! All SEO blog posts have been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
