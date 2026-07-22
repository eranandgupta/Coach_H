import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const posts = [
  {
    title: 'Intermittent Fasting for Indian Diet: 16/8 Weight Loss Guide',
    slug: 'intermittent-fasting-indian-diet-weight-loss',
    excerpt: 'A practical intermittent fasting guide for Indians: how 16/8 works with roti-dal-sabzi, what breaks a fast, a sample day, and who should avoid IF.',
    readTime: 11,
    content: `<p>Intermittent fasting is not a diet -- it is a <strong>schedule</strong> for when you eat. And that single change is why it works so well for busy Indians: you do not have to give up rice, roti, or your evening chai. You just fit your normal food into a shorter daily window, eat a little less overall without counting every calorie, and let your body spend more hours burning fat instead of storing it.</p>

<p>The most popular version -- <strong>16/8</strong> -- means you fast for 16 hours (mostly while you sleep) and eat within an 8-hour window. Done right, with Indian food and a realistic routine, it is one of the simplest, most sustainable tools for fat loss. This guide shows you exactly how to run it.</p>

<div class="stat-grid">
<div class="stat-card"><strong>16:8</strong>Most Popular, Beginner-Friendly Method</div>
<div class="stat-card"><strong>12-16 hrs</strong>Fasting Window Where Fat-Burning Ramps Up</div>
<div class="stat-card"><strong>300-500</strong>Calorie Deficit IF Naturally Creates for Many</div>
<div class="stat-card"><strong>0.25-0.5 kg</strong>Realistic, Sustainable Weekly Fat Loss</div>
</div>

<div class="callout-warning">
<strong>Medical note:</strong> Intermittent fasting is not for everyone. If you are pregnant or breastfeeding, underweight, have a history of eating disorders, or take medication for diabetes, thyroid, or blood pressure, talk to your doctor before starting. This guide is educational, not medical advice.
</div>

<hr>

<h2>What Is Intermittent Fasting (and Why It Works)</h2>

<p>Intermittent fasting (IF) cycles your day between a <strong>fasting window</strong> (only water, black coffee, or plain tea) and an <strong>eating window</strong> (your normal meals). It does not tell you <em>what</em> to eat -- it tells you <em>when</em>.</p>

<p>It helps weight loss in two honest, science-backed ways:</p>

<div class="highlight-box">
<p><strong>1. It naturally cuts calories.</strong> When you compress eating into 8 hours, most people simply eat one less meal or snack -- often 300-500 fewer calories a day -- without feeling deprived.</p>
<p><strong>2. It lowers insulin for longer.</strong> Long gaps without food let insulin drop, and lower insulin makes it easier for your body to release and burn stored fat. This is especially useful for people carrying belly fat.</p>
</div>

<div class="callout">
<strong>The honest truth:</strong> IF is not magic. It works because it helps you eat less and steadies your blood sugar. If you eat 2,500 calories of samosas and sweets inside an 8-hour window, you will not lose weight. The window is the tool -- the food still matters.
</div>

<hr>

<h2>Popular Intermittent Fasting Methods</h2>

<table>
<thead>
<tr><th>Method</th><th>How It Works</th><th>Best For</th></tr>
</thead>
<tbody>
<tr><td>16/8</td><td>Fast 16 hours, eat within 8 (e.g. 12 pm-8 pm)</td><td>Beginners -- the easiest place to start</td></tr>
<tr><td>14/10</td><td>Fast 14 hours, eat within 10</td><td>Women and total beginners easing in</td></tr>
<tr><td>5:2</td><td>Eat normally 5 days, very light (~500-600 kcal) on 2 non-consecutive days</td><td>People who dislike a daily eating window</td></tr>
<tr><td>OMAD</td><td>One meal a day (a ~1-2 hour window)</td><td>Advanced only -- hard to hit nutrition needs</td></tr>
</tbody>
</table>

<div class="callout-tip">
<strong>Start with 16/8 or even 14/10.</strong> Do not jump to OMAD. The best fasting protocol is the one you can repeat for months without bingeing -- consistency beats intensity every time.
</div>

<hr>

<h2>The 16/8 Method on an Indian Schedule</h2>

<p>The beauty of 16/8 is that most of the fast happens while you sleep. Pick an 8-hour eating window that fits <em>your</em> routine -- here are three that work well for Indian lifestyles:</p>

<table>
<thead>
<tr><th>Routine</th><th>Eating Window</th><th>Skip</th></tr>
</thead>
<tbody>
<tr><td>Skip breakfast</td><td>12:00 pm - 8:00 pm</td><td>Early breakfast; last meal by 8 pm</td></tr>
<tr><td>Early dinner</td><td>10:00 am - 6:00 pm</td><td>Late-night eating (great for belly fat)</td></tr>
<tr><td>Office-friendly</td><td>11:00 am - 7:00 pm</td><td>Bed tea snacks and post-dinner desserts</td></tr>
</tbody>
</table>

<p>During the fasting hours you can freely have <strong>water, black coffee, green tea, or plain black tea</strong> (no sugar, no milk). These keep you comfortable and do not break the fast.</p>

<div class="callout">
<strong>Indian reality check:</strong> The hardest part for most Indians is the morning <em>doodh wali chai</em>. Milk and sugar break your fast. Switch your first cup to black tea or black coffee, and save the milky chai for inside your eating window -- this one swap makes 16/8 far easier.
</div>

<hr>

<h2>What to Eat in Your Eating Window</h2>

<p>IF controls <em>when</em> you eat; good food choices control <em>how well</em> it works. Because you have fewer meals, each one needs to be nutrient-dense and protein-rich so you stay full and protect muscle.</p>

<div class="highlight-box">
<p><strong>Protein at every meal:</strong> Eggs, paneer, curd, dal, rajma, chana, soya, chicken, fish. Protein keeps you full through the next fast and preserves muscle during fat loss.</p>
<p><strong>Fibre-rich veg and salad:</strong> Palak, methi, lauki, bhindi, beans, cucumber, carrot -- volume that fills you up for very few calories.</p>
<p><strong>Smart carbs in portions:</strong> Roti, brown rice, millets (bajra, jowar, ragi), oats -- fuel for energy and workouts, kept to sensible portions.</p>
<p><strong>Healthy fats:</strong> Nuts, seeds, ghee in moderation, cold-pressed oils -- they steady blood sugar and keep meals satisfying.</p>
</div>

<h3>Sample 16/8 Indian Day (12 pm - 8 pm)</h3>

<table>
<thead>
<tr><th>Time</th><th>Meal</th><th>Why It Works</th></tr>
</thead>
<tbody>
<tr><td>Fasting (till 12 pm)</td><td>Water, black coffee or green tea</td><td>Keeps insulin low, appetite steady</td></tr>
<tr><td>12:00 pm (break fast)</td><td>2 besan/moong chilla + curd + big salad</td><td>Protein-led, gentle on the stomach</td></tr>
<tr><td>3:00 pm</td><td>2 roti + dal + palak paneer + sabzi</td><td>Balanced main meal with fibre and protein</td></tr>
<tr><td>5:30 pm</td><td>Handful of nuts + fruit, or roasted chana + chaas</td><td>Protein snack, no sugar crash</td></tr>
<tr><td>7:45 pm (close window)</td><td>Grilled chicken/fish or tofu + sauteed veg + small millet</td><td>Protein-forward, lighter carbs at night</td></tr>
<tr><td>After 8 pm</td><td>Water or plain black tea only</td><td>Fast begins -- most of it during sleep</td></tr>
</tbody>
</table>

<div class="callout-tip">
<strong>Hydration is non-negotiable.</strong> Drink 3-4 litres of water across the day. A lot of "fasting hunger" is actually thirst, and staying hydrated makes the fasting window almost effortless.
</div>

<hr>

<h2>What Breaks a Fast?</h2>

<div class="highlight-box">
<p><strong>Does NOT break your fast:</strong> Plain water, black coffee, green tea, plain black tea, sparkling water -- all with zero sugar and zero milk.</p>
<p><strong>Breaks your fast:</strong> Milk, sugar, honey, milky chai, biscuits, fruit, juice, buttermilk, anything with calories. Even a small snack ends the fast.</p>
</div>

<p>The rule is simple: if it has calories, it breaks the fast. When in doubt, stick to water, black coffee, or black/green tea until your window opens.</p>

<hr>

<h2>Intermittent Fasting and Exercise</h2>

<p>You can absolutely train while fasting -- millions do. The key is matching your workout to your energy and goals.</p>

<div class="highlight-box">
<p><strong>Fasted walking or light cardio</strong> in the morning is well tolerated and may nudge fat-burning. Keep it easy to moderate.</p>
<p><strong>Strength training</strong> is best done near the end of your fast or inside your eating window, so you can eat a protein-rich meal afterwards to recover and build muscle.</p>
<p><strong>Always prioritise protein</strong> across your eating window -- roughly 1.6-2 g per kg of bodyweight -- so fat loss comes from fat, not muscle.</p>
</div>

<div class="callout-warning">
<strong>Listen to your body:</strong> Dizziness, shakiness, or feeling faint during a fasted workout means you pushed too far. Shorten the fast, move the workout into your eating window, and never train fasted if you are managing blood sugar with medication.
</div>

<hr>

<h2>Who Should Be Careful With IF</h2>

<div class="callout-warning">
Intermittent fasting is <strong>not suitable</strong> for everyone. Avoid it or get medical clearance first if you are pregnant or breastfeeding, underweight or have a history of disordered eating, a growing teenager, or if you take medication for diabetes, thyroid, or blood pressure. Women with PCOS or thyroid issues sometimes do better with a gentler 12/12 or 14/10 window than aggressive fasting -- see our <a href="/blog/pcos-weight-loss-diet-exercise-plan-indian-women">PCOS weight loss guide</a> and <a href="/blog/thyroid-and-weight-loss-complete-guide-for-indian-women">thyroid guide</a> for a hormone-aware approach.
</div>

<hr>

<h2>Realistic Timeline: What to Expect</h2>

<table>
<thead>
<tr><th>Timeframe</th><th>What Usually Happens</th></tr>
</thead>
<tbody>
<tr><td>Week 1</td><td>Some hunger and adjustment; a little water weight drops</td></tr>
<tr><td>Week 2-4</td><td>Hunger settles, energy steadies, 1-2 kg down for many</td></tr>
<tr><td>Month 2-3</td><td>Consistent fat loss, fewer cravings, the routine feels natural</td></tr>
<tr><td>Month 3-6</td><td>Meaningful, visible changes and habits that stick</td></tr>
</tbody>
</table>

<blockquote>Intermittent fasting is a tool, not a religion. Use it as long as it helps you eat well and feel good -- and drop it without guilt if it ever starts running your life.</blockquote>

<hr>

<h2>Common Intermittent Fasting Mistakes</h2>

<ol>
<li><strong>Bingeing when the window opens:</strong> IF only works if you eat sensibly, not if you inhale two meals' worth of food at once.</li>
<li><strong>Too little protein:</strong> Fewer meals with poor protein means muscle loss and constant hunger. Anchor every meal with protein.</li>
<li><strong>Jumping straight to OMAD:</strong> Start at 16/8 or 14/10. Aggressive fasting from day one usually ends in a binge.</li>
<li><strong>Forgetting water:</strong> Dehydration masquerades as hunger and makes fasting miserable. Drink up.</li>
<li><strong>Milky chai during the fast:</strong> The most common Indian slip-up -- it quietly breaks your fast every morning.</li>
<li><strong>Expecting magic from the window alone:</strong> Fat loss still needs decent food, protein, sleep, and movement.</li>
</ol>

<hr>

<h2>Get a Plan Built Around Your Routine</h2>

<p><a href="/about">Coach Himanshu</a> builds nutrition and training plans that fit real Indian schedules -- including intermittent fasting done the right way, matched to your work hours, workouts, and health history. No crash diets, no giving up your favourite foods, just a structure you can actually keep.</p>

<p><a href="/assessment">Take the free fitness assessment</a> to get a plan tailored to your body and lifestyle, or <a href="/#plans">explore the coaching plans</a> for ongoing support. You may also like our guides on <a href="/blog/how-to-fix-belly-fat-science-based-guide-for-indians">fixing belly fat</a>, the <a href="/blog/best-workout-schedule-for-working-professionals-india">best workout schedule for working professionals</a>, and the <a href="/blog/best-diet-plan-for-muscle-building-in-india">best diet plan for muscle building</a> -- plus more on our <a href="/blog">fitness blog</a> and <a href="/knowledge">knowledge hub</a>.</p>

<hr>

<h2>Frequently Asked Questions</h2>

<h3>What is the best intermittent fasting method for beginners in India?</h3>
<p>Start with 16/8 -- fast for 16 hours and eat within an 8-hour window, such as 12 pm to 8 pm. Most of the fast happens while you sleep, so it is the easiest to sustain. If 16 hours feels hard at first, begin with 14/10 and gradually extend the fast as your body adjusts. The best method is always the one you can repeat consistently.</p>

<h3>Does tea or coffee break a fast?</h3>
<p>Plain black coffee, green tea, and plain black tea (all without milk or sugar) do not break your fast -- they have almost no calories and are fine during the fasting window. However, milky chai with sugar does break the fast. Swapping your morning doodh wali chai for black tea or black coffee is the single easiest way to make intermittent fasting work in India.</p>

<h3>Can I eat roti and rice during intermittent fasting?</h3>
<p>Yes. Intermittent fasting controls when you eat, not what you eat, so roti, rice, and millets are all allowed inside your eating window. For faster fat loss, keep carb portions sensible, pair them with protein and vegetables, and build meals around dal, paneer, curd, eggs, chicken, or fish. You do not need to go low-carb to benefit from IF.</p>

<h3>How much weight can I lose with intermittent fasting?</h3>
<p>A realistic, healthy rate is about 0.25-0.5 kg of fat per week, which adds up to meaningful change over a few months. IF helps mainly by naturally reducing your calorie intake and steadying blood sugar. Results depend on your food quality, protein intake, activity, and sleep -- the eating window is a helpful tool, not a guarantee on its own.</p>

<h3>Can I exercise while fasting?</h3>
<p>Yes. Light cardio and walking are well tolerated in a fasted state, and many people train comfortably before breaking their fast. For strength training, it is often best to lift near the end of your fast or inside your eating window so you can eat a protein-rich meal afterwards to recover. Stop and eat if you ever feel dizzy or shaky, and avoid fasted training if you take blood-sugar medication.</p>

<h3>Is intermittent fasting safe for women?</h3>
<p>Many women do well with intermittent fasting, but women can be more sensitive to aggressive fasting, and those with PCOS, thyroid issues, or irregular cycles sometimes respond better to a gentler 12/12 or 14/10 window. If you are pregnant, breastfeeding, underweight, or have a history of disordered eating, do not fast without medical guidance. Start gently and pay attention to your energy, mood, and cycle.</p>

<hr>

<p><em>Intermittent fasting works best when it fits your life, not the other way around. Pick one eating window that suits your routine and try it for two weeks. For a plan built around your schedule and goals, <a href="/assessment">take the free assessment</a> or explore more on the <a href="/knowledge">knowledge hub</a>.</em></p>`,
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

  console.log('\nDone! SEO blog post (batch 6) has been seeded/updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
