import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const posts = [
  {
    title: 'How Many Steps a Day to Lose Weight? (India Guide)',
    slug: 'how-many-steps-per-day-to-lose-weight',
    excerpt: 'How many steps a day to lose weight? The truth about the 10,000-step myth, how many steps you actually need by goal, and how to hit them in a busy Indian routine.',
    readTime: 9,
    content: `<p>For weight loss, most people do well aiming for <strong>8,000 to 12,000 steps a day</strong> -- and here is the surprise: the famous "10,000 steps" number was never based on science. It came from a 1960s marketing campaign, not a study.</p>

<p>Walking is one of the most underrated fat-loss tools there is: it's free, low-stress, easy on the joints, and something you can actually keep doing for life. This guide explains how many steps <em>you</em> need for your goal, why steps burn fat, and how to hit your number even with a desk job and a packed Indian schedule.</p>

<div class="stat-grid">
<div class="stat-card"><strong>1965</strong>Year the "10,000 steps" Idea Was Marketed</div>
<div class="stat-card"><strong>7,000-8,000</strong>Where Most Health Benefits Level Off</div>
<div class="stat-card"><strong>8,000-12,000</strong>A Practical Daily Range for Fat Loss</div>
<div class="stat-card"><strong>~300-500</strong>Calories Burned by an Active Step Day</div>
</div>

<div class="callout">
<strong>Quick answer:</strong> There is no magic number. Find your current daily average, then add 2,000-3,000 steps and hold it. For most people that lands in the 8,000-12,000 range -- enough to meaningfully support fat loss without living on a treadmill.
</div>

<hr>

<h2>The 10,000-Steps Myth</h2>

<p>The "10,000 steps a day" target did not come from health research. It came from a <strong>1965 Japanese pedometer</strong> called the <em>manpo-kei</em> -- literally "10,000-step meter." It was a catchy marketing slogan, and the round number simply stuck worldwide.</p>

<p>That doesn't make 10,000 a bad goal -- it's a fine target if you can hit it. But it's not a scientific threshold, and you don't fail if you do 8,000. Large studies show the biggest health gains come from simply moving <em>more than you do now</em>, with benefits climbing steeply from a low base and then leveling off.</p>

<div class="callout-tip">
<strong>The real rule:</strong> More than you're doing now is the win. Going from 3,000 to 7,000 steps matters far more than going from 9,000 to 10,000.
</div>

<hr>

<h2>How Many Steps Do You Actually Need?</h2>

<table>
<thead>
<tr><th>Your Situation</th><th>Daily Step Target</th></tr>
</thead>
<tbody>
<tr><td>Currently sedentary (starting out)</td><td>Add 2,000 to your current average, build up</td></tr>
<tr><td>General health & fitness</td><td>7,000-8,000</td></tr>
<tr><td>Active fat loss</td><td>8,000-12,000</td></tr>
<tr><td>Older adults (50+)</td><td>6,000-8,000 (benefits appear at fewer steps)</td></tr>
</tbody>
</table>

<div class="callout-tip">
<strong>Don't jump straight to a big number.</strong> If you currently average 3,000 steps, aiming for 10,000 overnight usually fails. Add 2,000-3,000, make it a habit for two weeks, then add more. Sustainable beats heroic.
</div>

<hr>

<h2>Why Steps Are So Effective for Fat Loss</h2>

<div class="highlight-box">
<p><strong>They raise your daily calorie burn (NEAT):</strong> All the movement you do outside workouts -- walking, standing, chores -- is called NEAT, and it can account for a big chunk of your total daily calorie expenditure. More steps = more NEAT = a bigger deficit.</p>
<p><strong>They're low-stress:</strong> Unlike intense cardio, walking doesn't spike stress hormones or leave you ravenously hungry, so it's easier to stay in a calorie deficit.</p>
<p><strong>They're sustainable:</strong> You can walk every day for years. Consistency, not intensity, is what actually changes your body.</p>
<p><strong>They help blood sugar:</strong> A short walk after meals blunts blood-sugar spikes -- especially useful for Indians managing weight, PCOS, or pre-diabetes.</p>
</div>

<div class="callout-warning">
<strong>But steps won't out-run a bad diet.</strong> Walking supports fat loss; it doesn't override calories. A single gulab jamun or samosa can undo a big chunk of your day's step burn. Steps + a sensible, protein-rich diet is what works.
</div>

<hr>

<h2>How Many Calories Do Steps Burn?</h2>

<p>A rough guide is <strong>30-50 calories per 1,000 steps</strong>, depending on your bodyweight and pace. So 10,000 steps burns roughly 300-500 calories for most people -- a genuinely useful addition to a fat-loss plan, but a supplement to good nutrition, not a replacement for it.</p>

<hr>

<h2>Steps vs Gym Workouts -- Which Matters More?</h2>

<p>They do different jobs, and you want both:</p>

<div class="highlight-box">
<p><strong>Steps / walking</strong> build your daily calorie burn and keep you consistently active -- great for fat loss and heart health.</p>
<p><strong>Strength training</strong> builds and preserves muscle, which shapes your body and keeps your metabolism up, especially during fat loss.</p>
</div>

<p>If you only did one, walk. If you want the best body-composition results, combine daily steps with 3 strength sessions a week and enough protein -- see our guide on <a href="/blog/how-much-protein-per-day-india">how much protein per day</a>.</p>

<hr>

<h2>How to Hit Your Steps in a Busy Indian Routine</h2>

<ol>
<li><strong>Walk after every meal:</strong> Even 10-15 minutes after lunch and dinner adds up and steadies blood sugar.</li>
<li><strong>Take calls on your feet:</strong> Pace during phone and video calls -- easy hundreds of steps.</li>
<li><strong>Get off one stop early / park farther:</strong> Build walking into your commute.</li>
<li><strong>Take the stairs:</strong> Skip the lift wherever you reasonably can.</li>
<li><strong>A morning or evening walk:</strong> One dedicated 30-40 minute walk can be 3,000-4,000 steps on its own.</li>
<li><strong>Track it:</strong> What gets measured gets done. Log your daily steps (the Coach Himanshu habit tracker has a steps field) so you can actually see and beat your average.</li>
</ol>

<hr>

<h2>Realistic Progression</h2>

<table>
<thead>
<tr><th>Week</th><th>Focus</th></tr>
</thead>
<tbody>
<tr><td>Week 1</td><td>Measure your current daily average -- no changes yet</td></tr>
<tr><td>Week 2-3</td><td>Add ~2,000 steps (post-meal walks); hold it daily</td></tr>
<tr><td>Week 4-6</td><td>Reach 8,000-10,000 consistently</td></tr>
<tr><td>Ongoing</td><td>Maintain your range; pair with strength + good nutrition</td></tr>
</tbody>
</table>

<blockquote>The best step count is the one you can hit every day without thinking about it. Walking is the habit that quietly does the heavy lifting for lifelong fat loss.</blockquote>

<hr>

<h2>Get a Plan That Fits Your Life</h2>

<p><a href="/about">Coach Himanshu</a> builds simple, sustainable plans that combine daily activity targets, personalised Indian nutrition, and strength training -- designed for real, busy schedules, not gym rats. NASM certified and tailored to your goals and routine.</p>

<p><a href="/assessment">Take the free fitness assessment</a> to get your plan, or <a href="/plans">explore the coaching plans</a>. You may also like our guides on <a href="/blog/how-to-fix-belly-fat-science-based-guide-for-indians">fixing belly fat</a>, <a href="/blog/how-to-lose-weight-without-going-to-gym">losing weight without a gym</a>, and the <a href="/blog/best-workout-schedule-for-working-professionals-india">best workout schedule for working professionals</a> -- plus more on our <a href="/blog">fitness blog</a>.</p>

<hr>

<h2>Frequently Asked Questions</h2>

<h3>How many steps a day to lose weight?</h3>
<p>Most people lose weight well aiming for 8,000 to 12,000 steps a day, combined with a sensible calorie deficit and enough protein. There is no magic number -- the most effective target is simply more than your current average. If you are sedentary, start by adding 2,000 to 3,000 steps and build up gradually rather than jumping straight to a high number.</p>

<h3>Is 10,000 steps a day necessary?</h3>
<p>No. The "10,000 steps" figure came from a 1965 Japanese pedometer marketing campaign, not from research. Studies show most health benefits appear well before 10,000 -- often around 7,000 to 8,000 steps, and even fewer for older adults. 10,000 is a perfectly good goal if you can hit it, but it is not a required threshold.</p>

<h3>Can I lose weight just by walking?</h3>
<p>Walking can absolutely support weight loss by increasing your daily calorie burn, and many people lose fat primarily through more steps plus better eating. However, walking works only alongside a sensible diet -- it cannot out-run excess calories. For the best body shape, combine daily steps with strength training and adequate protein.</p>

<h3>How many calories do 10,000 steps burn?</h3>
<p>Roughly 300 to 500 calories for most people, though it varies with bodyweight and walking pace -- about 30 to 50 calories per 1,000 steps. That is a meaningful contribution to a fat-loss plan, but it is a supplement to good nutrition, not a licence to eat whatever you want.</p>

<h3>Is walking after meals good for weight loss?</h3>
<p>Yes. A 10 to 15 minute walk after meals helps blunt blood-sugar spikes and adds easy steps to your day. It is especially helpful for Indians managing weight, PCOS, or pre-diabetes, and it is one of the simplest habits to build because it attaches to something you already do -- eating.</p>

<h3>Are steps better than going to the gym?</h3>
<p>They do different things and you ideally want both. Steps build your daily calorie burn and keep you consistently active; strength training builds and preserves muscle, which shapes your body and supports your metabolism. If you could only do one, walk daily -- but combining steps with three weekly strength sessions gives the best results.</p>

<hr>

<p><em>Forget the perfect number -- just move more than you did yesterday and keep it consistent. Track your steps, walk after meals, and pair it with good food. For a plan built around your routine, <a href="/assessment">take the free assessment</a> or explore the <a href="/knowledge">knowledge hub</a>.</em></p>`,
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
        readTime: post.readTime,
        authorId: coach.id,
        published: true,
        publishedAt: new Date(),
      },
    });

    console.log(`Upserted: "${result.title}" (ID: ${result.id})`);
  }

  console.log('\nDone! SEO blog post (batch 10) has been seeded/updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
