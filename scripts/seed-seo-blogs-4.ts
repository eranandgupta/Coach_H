import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const posts = [
  {
    title: 'Couple Workout Plan: Train Together, Transform Together',
    slug: 'couple-workout-plan-train-together-india',
    excerpt: 'A complete couple workout plan for India: home exercises for two, a weekly routine, partner drills, diet tips, and how training together keeps both of you consistent.',
    readTime: 9,
    content: `<p>The single biggest reason people quit their fitness journey is not a lack of knowledge -- it is a lack of consistency. And the most powerful, underused tool for consistency is sitting right next to you on the sofa: <strong>your partner</strong>. When two people commit to getting fit together, missed workouts, "I'll start Monday" excuses, and late-night snacking all get much harder to get away with.</p>

<p>This is your complete <strong>couple workout plan</strong> -- built for Indian homes, Indian schedules, and Indian kitchens. You will get partner exercises you can do with zero equipment, a realistic weekly routine, a shared-nutrition strategy, and an honest look at what to do when one partner is fitter than the other.</p>

<div class="stat-grid">
<div class="stat-card"><strong>2×</strong>More Likely to Stick With Exercise When You Train Together</div>
<div class="stat-card"><strong>30 min</strong>Minimum Effective Home Session for a Couple</div>
<div class="stat-card"><strong>1 Slot</strong>Both Partners, Same Live Session (Couple 1:1 Plan)</div>
<div class="stat-card"><strong>3-4×</strong>Sessions Per Week to See Real Change</div>
</div>

<hr>

<h2>Why Training With Your Partner Actually Works</h2>

<p>This is not just a feel-good idea. Behavioural research on exercise adherence consistently shows that <strong>social accountability</strong> is one of the strongest predictors of whether someone sticks with a programme. When your workout is also a shared appointment with someone you love, skipping it has a real cost.</p>

<div class="highlight-box">
<p><strong>Built-in accountability:</strong> It is far harder to hit snooze when your partner is already lacing up. You each become the other's coach and conscience.</p>
<p><strong>Shared identity:</strong> "We are a couple that trains" becomes part of your relationship, not a solo chore competing for time.</p>
<p><strong>Quality time that counts:</strong> A 30-minute workout is 30 minutes together -- no phones, no TV -- that also improves your health.</p>
<p><strong>Emotional support on hard days:</strong> Motivation is never at 100% for both people at once. On the days you are flat, your partner carries the momentum, and vice versa.</p>
<p><strong>Aligned lifestyle:</strong> When both of you are eating better and moving more, the home environment stops sabotaging your goals.</p>
</div>

<div class="callout">
<strong>The consistency multiplier:</strong> A perfect programme done alone and abandoned in three weeks beats nothing -- but it loses badly to a simple programme two partners actually keep doing for a year. Fitness is won by the couple that shows up in month six, not the one with the fanciest month-one plan.
</div>

<hr>

<h2>The No-Equipment Couple Home Workout</h2>

<p>You do not need a gym, machines, or even dumbbells to start. This full-body session uses only bodyweight and each other. Do each exercise for the reps listed, rest 45-60 seconds, and complete 3 rounds. It takes about 30 minutes.</p>

<table>
<thead>
<tr><th>Exercise</th><th>Reps</th><th>How You Work Together</th></tr>
</thead>
<tbody>
<tr><td>Bodyweight squats (synced)</td><td>15 each</td><td>Face each other and squat in rhythm -- match depth and tempo</td></tr>
<tr><td>Push-ups (partner tap)</td><td>10 each</td><td>At the top of each rep, tap your partner's opposite hand</td></tr>
<tr><td>Plank hold + shoulder tap</td><td>30-45 sec</td><td>Hold planks facing each other, tapping each other's shoulders</td></tr>
<tr><td>Glute bridges (synced)</td><td>15 each</td><td>Lie side by side, lift and lower together, squeeze at the top</td></tr>
<tr><td>Wall sit challenge</td><td>Max hold</td><td>Sit against the wall together -- last one up wins</td></tr>
<tr><td>Alternating lunges</td><td>10/leg</td><td>Mirror each other's stride for balance and form checks</td></tr>
</tbody>
</table>

<div class="callout-tip">
<strong>Beginner modification:</strong> If push-ups on the floor are too hard, do them against a wall or a kitchen counter. If squats hurt the knees, squat down to a chair and stand back up. Progress is about doing the movement well, not doing the hardest version.
</div>

<h3>Partner-Assisted Exercises (Using Each Other as Resistance)</h3>

<div class="highlight-box">
<p><strong>Partner-resisted rows:</strong> Sit facing each other, hold a rolled towel between you, and take turns pulling while the other gently resists. Builds the back with zero equipment.</p>
<p><strong>Wheelbarrow walks:</strong> One partner holds the other's ankles while they walk on their hands -- a serious core and shoulder challenge (start with short distances).</p>
<p><strong>Partner-assisted stretching:</strong> Gentle assisted hamstring and shoulder stretches after the workout improve flexibility and build trust.</p>
<p><strong>Boxing/pad rounds:</strong> One holds the palms up as targets, the other punches for 60 seconds -- fantastic cardio and stress relief, then switch.</p>
</div>

<hr>

<h2>A Realistic Weekly Couple Routine</h2>

<p>Consistency beats intensity. This 4-day plan fits around real Indian work and family schedules, with rest built in.</p>

<table>
<thead>
<tr><th>Day</th><th>Focus</th><th>Duration</th></tr>
</thead>
<tbody>
<tr><td>Monday</td><td>Full-body home circuit (the workout above)</td><td>30 min</td></tr>
<tr><td>Tuesday</td><td>Brisk walk together after dinner</td><td>25-30 min</td></tr>
<tr><td>Wednesday</td><td>Rest or gentle stretching / yoga</td><td>-</td></tr>
<tr><td>Thursday</td><td>Full-body home circuit (add 1 extra round)</td><td>35 min</td></tr>
<tr><td>Friday</td><td>Cardio you both enjoy -- dance, cycling, stairs</td><td>25 min</td></tr>
<tr><td>Saturday</td><td>Longer activity -- hike, sport, or a park session</td><td>45 min</td></tr>
<tr><td>Sunday</td><td>Complete rest and meal prep for the week</td><td>-</td></tr>
</tbody>
</table>

<div class="callout">
<strong>The 3-of-4 rule:</strong> Aim for all four structured days, but agree in advance that hitting three out of four is a successful week. This removes the all-or-nothing trap that ends most couple fitness attempts after a bad week.
</div>

<hr>

<h2>Eating Well Together: The Indian Kitchen Advantage</h2>

<p>Couples who cook and eat together have a huge edge -- one healthy kitchen serves both of you. You do not need separate "diet food"; you need better versions of the food you already love.</p>

<div class="highlight-box">
<p><strong>Cook once, portion twice:</strong> Make one high-protein sabzi or curry -- paneer, chana, rajma, soya, chicken, or fish -- and simply adjust roti and rice portions to each person's needs.</p>
<p><strong>Protein at every meal:</strong> Add dal, curd, eggs, paneer, or sprouts to breakfast and dinner so you both stay full and preserve muscle.</p>
<p><strong>Shared grocery discipline:</strong> If the namkeen and biscuits are not in the house, neither of you eats them at 11 PM. Keep fruit, roasted chana, and nuts visible instead.</p>
<p><strong>Hydrate together:</strong> Keep a shared water target -- 3 litres each -- and remind one another through the day.</p>
</div>

<div class="callout-tip">
<strong>Different calorie needs, same meals:</strong> Men usually need more total calories than women. Keep the food identical and simply serve the larger eater one extra roti or an extra scoop of rice. Simple, sustainable, no separate cooking.
</div>

<p>For deeper nutrition detail, see our guides on the <a href="/blog/best-diet-plan-for-muscle-building-in-india">best diet plan for muscle building in India</a> and <a href="/blog/best-pre-and-post-workout-meals-for-indian-diet">the best pre and post workout meals for an Indian diet</a>.</p>

<hr>

<h2>When One Partner Is Fitter Than the Other</h2>

<p>This is the most common reason couple fitness falls apart -- and it is completely solvable. The goal is to train <em>together</em>, not identically.</p>

<div class="highlight-box">
<p><strong>Same exercise, different level:</strong> While one does full push-ups, the other does incline push-ups. Same movement, matched effort, finished at the same time.</p>
<p><strong>Match effort, not weight:</strong> Success is both of you working at a hard-but-doable intensity -- not lifting the same load or doing the same reps.</p>
<p><strong>Let the fitter partner set the tone, not the pace:</strong> The stronger person leads on discipline and encouragement, never on shaming the other for going slower.</p>
<p><strong>Avoid unhealthy competition:</strong> A wall-sit contest is fun; comparing weight-loss numbers weekly usually is not. Celebrate each person's own progress.</p>
</div>

<div class="callout-warning">
<strong>Watch the resentment trap:</strong> If one partner constantly waits, corrects, or out-performs the other, the workout becomes a source of friction instead of connection. Structure the plan so both people succeed on their own terms every session.
</div>

<hr>

<h2>Want a Coach to Train Both of You Together?</h2>

<p>If you want expert structure without the guesswork, <a href="/about">Coach Himanshu</a> now offers a dedicated <strong>Couple 1:1 coaching plan</strong>. It is built around exactly the idea in this article: you and your partner train together, in the <strong>same live session slot</strong>, guided in real time.</p>

<div class="highlight-box">
<p><strong>One shared account:</strong> A couple gets a single login and dashboard -- simple, no juggling two accounts.</p>
<p><strong>One session, both partners:</strong> Both of you attend the same live 1:1 slot together, so scheduling is effortless.</p>
<p><strong>Personalised for each of you:</strong> Separate diet plans and individual assessments, so the coaching fits each partner's body and goals.</p>
<p><strong>Flexible packages:</strong> Couple 1:1 plans start at <strong>₹11,999</strong> and scale up to 72 sessions for couples who want a long, guided transformation.</p>
</div>

<p>Not sure where to begin? <a href="/assessment">Take the free fitness assessment</a> and get a plan matched to both of you, or <a href="/#plans">explore the coaching plans</a> to compare options. You can also read about <a href="/blog/top-10-home-workout-exercises-for-beginners-in-india">the top home workout exercises for beginners</a> to build your base first.</p>

<hr>

<h2>Frequently Asked Questions</h2>

<h3>Is it actually better to work out with your partner?</h3>
<p>For most people, yes. Training with a partner improves consistency through built-in accountability, turns exercise into shared quality time, and provides motivation on low-energy days. The workout itself does not need to be different -- the advantage comes from being far more likely to keep showing up, which is what actually drives results over months and years.</p>

<h3>Can couples with very different fitness levels train together?</h3>
<p>Absolutely. The key is to do the same exercises at different difficulty levels -- for example, one partner does full push-ups while the other does incline push-ups against a counter. Match effort rather than weight or reps, so both people work hard, finish together, and feel successful. Training together does not mean training identically.</p>

<h3>How many days a week should a couple work out?</h3>
<p>Three to four structured sessions per week is the sweet spot for visible results while staying sustainable. A practical split is two full-body home workouts plus one or two cardio or activity days, with two rest days. Consistency across months matters far more than squeezing in daily workouts and burning out.</p>

<h3>Do we need any equipment to start a couple workout at home?</h3>
<p>No. A complete full-body couple workout can be done with only bodyweight and each other -- squats, push-ups, planks, glute bridges, lunges, and partner-assisted drills. As you get stronger, a single pair of adjustable dumbbells (around ₹1,500-3,000) is the only upgrade most couples ever need at home.</p>

<h3>How does the Couple 1:1 coaching plan work?</h3>
<p>The Couple 1:1 plan gives a couple one shared account, login, and dashboard, and both partners attend the same live 1:1 session slot together. Each partner still gets a personalised diet plan and their own assessment, so the coaching is tailored to both bodies and goals. Plans start at ₹11,999 and are available in 12, 24, 36, and 72-session packages.</p>

<h3>Will training together help us lose weight faster?</h3>
<p>Training together does not change the physiology of fat loss -- a calorie deficit and adequate protein still drive weight loss. What it changes is adherence: couples who support each other tend to stay consistent with both workouts and diet, and consistency is what produces steady, lasting results. In practice, that shared discipline often makes couples succeed where solo attempts stall.</p>

<hr>

<p><em>Fitness is more fun -- and far more sustainable -- when you are not doing it alone. Start with one 30-minute session together this week, and let momentum do the rest. Explore more guides on our <a href="/blog">fitness blog</a> or learn how structured coaching works on the <a href="/knowledge">knowledge hub</a>.</em></p>`,
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

  console.log('\nDone! SEO blog post (batch 4) has been seeded/updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
