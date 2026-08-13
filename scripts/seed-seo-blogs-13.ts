import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const posts = [
  {
    title: 'How to Start Your Fitness Journey This Independence Day',
    slug: 'how-to-start-your-fitness-journey-india',
    excerpt: 'Ready for azaadi from excuses? A simple, no-overwhelm guide to starting your fitness journey in India — the first 4 weeks, diet, workouts and mindset.',
    readTime: 10,
    content: `<p>The best day to start your fitness journey isn't January 1st — it's today. This Independence Day, the freedom worth fighting for is <strong>azaadi from excuses, crash diets, and the belief that you need a perfect plan before you begin</strong>. You don't. You need one honest first step.</p>

<p>This guide walks you through exactly how to start getting fit in India — without a fancy gym, without giving up dal-chawal, and without burning out in week two. No jargon, no extremes, just the first 4 weeks laid out simply so you can actually stick with it.</p>

<div class="stat-grid">
<div class="stat-card"><strong>Today</strong>The Best Day to Start</div>
<div class="stat-card"><strong>4 Weeks</strong>To Build the First Real Habit</div>
<div class="stat-card"><strong>7,000+</strong>Steps a Day to Begin With</div>
<div class="stat-card"><strong>No Gym</strong>Needed to Get Started</div>
</div>

<div class="callout">
<strong>Quick answer:</strong> Start with three things you can do this week — walk 7,000+ steps a day, eat protein at every meal, and do 2-3 short strength sessions. Master consistency first; add intensity later. That's it. Everything else is detail.
</div>

<hr>

<h2>Why Most Fitness Journeys Fail in Week Two</h2>

<p>People don't quit because they're lazy. They quit because they start too hard. A 6-day gym split, 1,200-calorie diet, no rice, no sugar, wake up at 5am — all at once, from zero. It's unsustainable by design, and when it collapses, they blame themselves instead of the plan.</p>

<div class="callout-warning">
<strong>The real enemy isn't your willpower — it's overwhelm.</strong> Doing five new things badly beats nothing, but doing two things consistently beats everything. Start smaller than you think you need to.
</div>

<hr>

<h2>Step 1: Get Clear on Your "Why"</h2>

<p>Before diet and workouts, get honest about why you want this. "To look good" fades in week two. Anchor to something that lasts:</p>

<div class="highlight-box">
<p><strong>Health:</strong> Keeping diabetes, blood pressure, or fatty liver away — a real concern for millions of Indians.</p>
<p><strong>Energy:</strong> Not crashing at 4pm, keeping up with your kids, feeling strong through a long workday.</p>
<p><strong>Confidence:</strong> Fitting into old clothes, standing taller, feeling in control of your body again.</p>
<p><strong>Freedom:</strong> Azaadi from breathlessness on stairs, from constant tiredness, from the excuses that have held you back for years.</p>
</div>

<hr>

<h2>Step 2: Fix Your Diet Before Your Workout</h2>

<p>Diet drives 70-80% of results. You cannot out-train a bad one. The good news: you don't need to give up Indian food — just rebalance your plate.</p>

<table>
<thead>
<tr><th>Do This</th><th>Why It Works</th></tr>
</thead>
<tbody>
<tr><td>Protein at every meal (dal, eggs, paneer, curd, chicken, soya)</td><td>Keeps you full, protects muscle, curbs cravings</td></tr>
<tr><td>Fill half your plate with sabzi/salad</td><td>Fibre and volume for fewer calories</td></tr>
<tr><td>Keep rice/roti — just portion it</td><td>Sustainable beats "no carbs" that never lasts</td></tr>
<tr><td>Cut sugary chai, colds drinks, packaged snacks</td><td>The easiest calories to remove without hunger</td></tr>
<tr><td>Drink 2.5-3 litres of water a day</td><td>Reduces false hunger and fatigue</td></tr>
</tbody>
</table>

<div class="callout-tip">
<strong>Start with one change, not ten.</strong> This week, just add protein to every meal. Next week, cut the sugary drinks. Layering small changes sticks far better than overhauling everything overnight — see our guide on <a href="/blog/how-much-protein-per-day-india">how much protein you need per day</a>.
</div>

<hr>

<h2>Step 3: Move Every Day (Start With Walking)</h2>

<p>You don't need a gym membership to begin. Walking is the most underrated fat-loss tool there is — free, joint-friendly, and impossible to overdo.</p>

<ol>
<li><strong>Aim for 7,000+ steps a day</strong> to start, building toward 8,000-10,000.</li>
<li>Take a 10-15 minute walk after meals — great for digestion and blood sugar.</li>
<li>Use stairs, park farther, walk during phone calls — steps add up invisibly.</li>
</ol>

<div class="callout-tip">
<strong>Steps are the perfect week-one goal</strong> because you literally cannot fail at them. Read more on <a href="/blog/how-many-steps-per-day-to-lose-weight">how many steps a day to lose weight</a>.
</div>

<hr>

<h2>Step 4: Add Strength Training (2-3x a Week)</h2>

<p>Strength training keeps muscle while you lose fat, shapes your body, and boosts metabolism. You can start entirely at home with bodyweight — no equipment needed.</p>

<table>
<thead>
<tr><th>Beginner Home Moves</th><th>Targets</th></tr>
</thead>
<tbody>
<tr><td>Squats / chair sit-to-stand</td><td>Legs, glutes</td></tr>
<tr><td>Knee or wall push-ups</td><td>Chest, shoulders, arms</td></tr>
<tr><td>Glute bridges</td><td>Glutes, lower back</td></tr>
<tr><td>Plank (start with 15-20s)</td><td>Core, whole body</td></tr>
</tbody>
</table>

<p>Do 2-3 rounds, 2-3 times a week. That's enough to start. Progress by adding reps, then difficulty. Our <a href="/blog/top-10-home-workout-exercises-for-beginners-in-india">top 10 home workout exercises for beginners</a> gives you a full routine to follow.</p>

<hr>

<h2>Your First 4 Weeks (Simple Plan)</h2>

<table>
<thead>
<tr><th>Week</th><th>Focus</th></tr>
</thead>
<tbody>
<tr><td>Week 1</td><td>Walk 7,000 steps daily + add protein to every meal</td></tr>
<tr><td>Week 2</td><td>Keep week 1 + cut sugary drinks and packaged snacks</td></tr>
<tr><td>Week 3</td><td>Keep above + start 2 short home strength sessions</td></tr>
<tr><td>Week 4</td><td>Keep above + add a 3rd session, walk 8,000+ steps</td></tr>
</tbody>
</table>

<div class="callout">
<strong>Notice what's missing:</strong> no starvation, no 5am boot camp, no giving up your culture's food. Just small, stacking wins. By week 4, you've built the habits most people never do — and that's what actually changes your body over the months that follow.
</div>

<hr>

<h2>Step 5: Track, and Be Patient</h2>

<p>Progress in the first month is often invisible on the scale. Don't panic and quit. Track more than weight:</p>

<div class="highlight-box">
<p><strong>Measurements:</strong> Waist, in particular — it often drops even when the scale doesn't.</p>
<p><strong>Photos:</strong> Front, side, back once a week in the same light. The mirror lies day to day; photos don't.</p>
<p><strong>Energy &amp; strength:</strong> More reps, longer walks, better sleep — these come before visible change and predict it.</p>
</div>

<blockquote>You didn't get unfit in a month, and you won't get fit in one either. Fitness is a habit you keep, not a challenge you finish. Play the long game and it works every single time.</blockquote>

<hr>

<h2>Celebrate Your Freedom — Start Today</h2>

<p>This Independence Day, give yourself real azaadi: freedom from excuses, from yo-yo dieting, and from putting your health last. You don't need the perfect Monday, the perfect plan, or the perfect body to begin. You need to start — imperfectly, today.</p>

<p><a href="/about">Coach Himanshu</a> is a NASM-certified coach who builds simple, personalised plans around your real Indian lifestyle — your food, your schedule, your starting point. No crash diets, no punishment, just a plan you can actually keep.</p>

<p><a href="/assessment">Take the free fitness assessment</a> to get your starting plan, or <a href="/plans">explore the coaching plans</a>. You may also like <a href="/blog/how-to-lose-weight-without-going-to-gym">how to lose weight without a gym</a>, <a href="/blog/complete-guide-to-body-transformation-in-90-days">the 90-day transformation guide</a>, and more on our <a href="/blog">fitness blog</a> and <a href="/knowledge">knowledge hub</a>.</p>

<hr>

<h2>Frequently Asked Questions</h2>

<h3>How do I start my fitness journey as a complete beginner in India?</h3>
<p>Start with three simple things you can do this week: walk at least 7,000 steps a day, add a protein source (dal, eggs, paneer, curd, chicken or soya) to every meal, and do two or three short bodyweight strength sessions at home. Don't try to change everything at once. Master consistency with these basics first, then add intensity and detail over the following weeks. You do not need a gym, supplements, or a perfect plan to begin.</p>

<h3>Do I need a gym to get fit?</h3>
<p>No. You can start and make excellent progress entirely at home. Daily walking handles most of your fat loss, and bodyweight moves like squats, push-ups, glute bridges and planks build real strength with zero equipment. A gym or dumbbells help later as you get stronger, but they are not required to begin your fitness journey or to see results in the first few months.</p>

<h3>What should I eat to start losing weight in India?</h3>
<p>Keep your Indian meals but rebalance the plate: protein at every meal, half the plate as sabzi or salad, and a controlled portion of rice or roti. Cut the easy, hidden calories first — sugary chai, cold drinks, and packaged snacks — and drink 2.5 to 3 litres of water daily. You don't need to give up rice or go on an extreme diet; sustainable, portion-controlled Indian food works far better long term.</p>

<h3>How long does it take to see results?</h3>
<p>Most beginners notice better energy, sleep and strength within the first 2 to 3 weeks, while visible changes in the mirror and on the scale usually take 6 to 12 weeks of consistency. The first month is about building habits, not chasing fast results. Track your waist measurement and weekly photos, not just the scale — progress often shows there first. Be patient; steady change that lasts always beats rapid results that don't.</p>

<h3>What is the biggest mistake beginners make?</h3>
<p>Starting too hard, too fast. People jump into a 6-day gym split, an extreme low-calorie diet, and 5am workouts all at once, then burn out within two weeks and blame themselves. The fix is to start smaller than feels necessary — two or three habits done consistently beat ten done briefly. Fitness is a marathon of small, repeatable wins, not a sprint you power through on motivation alone.</p>

<h3>How do I stay consistent and not quit?</h3>
<p>Anchor to a strong "why" beyond looks — health, energy, confidence, or freedom from feeling tired and unfit. Set goals you can't fail at first (like a daily step count), track progress in more than one way, and build habits in small layers rather than all at once. Having a coach or accountability also dramatically improves consistency, because someone adjusting your plan and checking in keeps you going on the days motivation dips.</p>

<hr>

<p><em>The freedom you want starts with a single step, taken today. Walk, add protein, move a little — and let consistency do the rest over the months ahead. When you're ready for a plan built around your life, <a href="/assessment">take the free assessment</a> or explore the <a href="/knowledge">knowledge hub</a>. Happy Independence Day — here's to your azaadi from excuses.</em></p>`,
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
    const result = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        readTime: post.readTime,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        authorId: coach.id,
        published: true,
        publishedAt: new Date(),
      },
    });

    console.log(`Upserted: "${result.title}" (ID: ${result.id})`);
  }

  console.log('\nDone! SEO blog post (batch 13) has been seeded/updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
