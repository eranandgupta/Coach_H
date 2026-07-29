import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const posts = [
  {
    title: 'How Much Protein Per Day? Indian Guide to Muscle & Fat Loss',
    slug: 'how-much-protein-per-day-india',
    excerpt: 'How much protein per day do you really need? A simple, science-backed Indian guide with g/kg targets by goal, the best veg & non-veg sources, and how to hit your number.',
    readTime: 11,
    content: `<p>For most active Indians, the answer is <strong>1.6 to 2.2 grams of protein per kilogram of bodyweight per day</strong> -- so a 70 kg person needs roughly <strong>112 to 154 g</strong>. That single number does more for fat loss and muscle building than almost any supplement, fancy workout, or diet trend you can name.</p>

<p>Yet most Indians eat far too little of it. Our meals are built around rice, roti, and potatoes -- carb-heavy and protein-light. This guide gives you your exact daily protein target based on your goal, the best Indian foods to hit it (vegetarian and non-vegetarian), and a simple plan to actually get there.</p>

<div class="stat-grid">
<div class="stat-card"><strong>1.6-2.2 g/kg</strong>Daily Protein for Muscle & Fat Loss</div>
<div class="stat-card"><strong>20-40 g</strong>Protein Per Meal for Best Muscle Response</div>
<div class="stat-card"><strong>~50%</strong>of Indians Fall Short of Their Protein Need</div>
<div class="stat-card"><strong>#1</strong>Nutrient for Fullness, Muscle & Metabolism</div>
</div>

<div class="callout">
<strong>Quick answer:</strong> Multiply your bodyweight in kg by 1.6 (minimum for an active person) up to 2.2 (for serious muscle building or aggressive fat loss). That range is your daily protein target in grams. Everything below explains how to fine-tune and hit it.
</div>

<hr>

<h2>How Much Protein Do You Need? (By Goal)</h2>

<p>The official RDA of 0.8 g/kg is the bare minimum to <em>avoid deficiency</em> in a sedentary person -- it is not the amount that helps you build muscle, lose fat, or stay strong as you age. If you train, you need more.</p>

<table>
<thead>
<tr><th>Your Goal</th><th>Protein Target</th><th>Example (70 kg)</th></tr>
</thead>
<tbody>
<tr><td>General health, sedentary</td><td>1.0-1.2 g/kg</td><td>70-84 g</td></tr>
<tr><td>Fat loss (preserve muscle)</td><td>1.8-2.2 g/kg</td><td>126-154 g</td></tr>
<tr><td>Muscle building</td><td>1.6-2.2 g/kg</td><td>112-154 g</td></tr>
<tr><td>Active senior (50+)</td><td>1.2-1.6 g/kg</td><td>84-112 g</td></tr>
</tbody>
</table>

<div class="callout-tip">
<strong>Cutting fat? Eat more protein, not less.</strong> Higher protein during a calorie deficit protects muscle, keeps you full, and slightly raises the calories you burn digesting food. This is why fat-loss targets are at the top of the range.
</div>

<h3>If You Are Overweight, Use a Realistic Number</h3>
<p>If you carry a lot of excess fat, calculating protein from your <em>current</em> weight can overshoot. Use your <strong>target or "ideal" bodyweight</strong> (or roughly 1.6-2.0 g per kg of a realistic goal weight) instead. Precision matters less than consistency -- get close and stay consistent.</p>

<hr>

<h2>Calculate Your Number in 10 Seconds</h2>

<div class="highlight-box">
<p><strong>Step 1:</strong> Take your bodyweight in kg (e.g., 65 kg).</p>
<p><strong>Step 2:</strong> Pick your multiplier -- 1.6 (active), 2.0 (building muscle or losing fat).</p>
<p><strong>Step 3:</strong> Multiply. 65 x 2.0 = <strong>130 g of protein per day</strong>.</p>
<p><strong>Step 4:</strong> Split it across your meals -- roughly 25-40 g each, 3-4 times a day.</p>
</div>

<hr>

<h2>Why Indians Fall Short on Protein</h2>

<p>A typical Indian plate -- two rotis, a big bowl of rice, aloo sabzi, and a small katori of dal -- might deliver only 15-20 g of protein for 600+ calories. The food is filling and carb-rich, but protein-poor. Common reasons Indians under-eat protein:</p>

<div class="highlight-box">
<p><strong>Carb-centric meals:</strong> Rice and roti take centre stage; protein is a side, not the base.</p>
<p><strong>Under-counting dal:</strong> One katori of cooked dal has only ~7-8 g protein, not the 20 g many assume.</p>
<p><strong>Vegetarian by default:</strong> Plant proteins are excellent but less concentrated, so portions must be bigger and more deliberate.</p>
<p><strong>Skipping breakfast protein:</strong> Poha, paratha, or bread-based breakfasts are almost pure carbs.</p>
</div>

<div class="callout">
<strong>The fix is simple:</strong> Make protein the anchor of every meal, then build carbs and vegetables around it -- instead of the other way round.
</div>

<hr>

<h2>Best Protein Sources for Indians</h2>

<p>You do not need exotic or expensive foods. Here is the protein in common Indian foods, so you can build meals that add up.</p>

<h3>Vegetarian Protein Sources</h3>

<table>
<thead>
<tr><th>Food</th><th>Serving</th><th>Protein</th></tr>
</thead>
<tbody>
<tr><td>Soya chunks (dry)</td><td>50 g (about 1 cup cooked)</td><td>~26 g</td></tr>
<tr><td>Paneer</td><td>100 g</td><td>~18-20 g</td></tr>
<tr><td>Tofu</td><td>100 g</td><td>~10-12 g</td></tr>
<tr><td>Rajma / chana (cooked)</td><td>1 katori</td><td>~9 g</td></tr>
<tr><td>Dal (cooked)</td><td>1 katori</td><td>~7-8 g</td></tr>
<tr><td>Curd / dahi</td><td>1 cup (200 g)</td><td>~7 g</td></tr>
<tr><td>Milk</td><td>1 glass (250 ml)</td><td>~8 g</td></tr>
<tr><td>Peanuts</td><td>30 g</td><td>~8 g</td></tr>
</tbody>
</table>

<h3>Non-Vegetarian Protein Sources</h3>

<table>
<thead>
<tr><th>Food</th><th>Serving</th><th>Protein</th></tr>
</thead>
<tbody>
<tr><td>Chicken breast</td><td>100 g</td><td>~31 g</td></tr>
<tr><td>Fish (rohu, surmai, etc.)</td><td>100 g</td><td>~22 g</td></tr>
<tr><td>Eggs</td><td>2 large</td><td>~12 g</td></tr>
<tr><td>Egg whites</td><td>4</td><td>~14 g</td></tr>
</tbody>
</table>

<div class="callout-tip">
<strong>Vegetarian?</strong> Soya chunks are your secret weapon -- gram for gram one of the highest-protein foods available in India and very cheap. Pair different plant proteins across the day (dal + rice, rajma + roti) to cover all amino acids easily.
</div>

<hr>

<h2>How to Hit Your Protein Target</h2>

<p>The trick is not one giant protein meal -- it is spreading protein across the day so muscle-building stays "switched on." Aim for 20-40 g per meal.</p>

<h3>Sample High-Protein Indian Day (~130 g)</h3>

<table>
<thead>
<tr><th>Meal</th><th>Example</th><th>Protein</th></tr>
</thead>
<tbody>
<tr><td>Breakfast</td><td>3 egg / besan chilla + 1 glass milk</td><td>~25 g</td></tr>
<tr><td>Lunch</td><td>Chicken/soya curry + dal + 2 roti + curd</td><td>~40 g</td></tr>
<tr><td>Snack</td><td>Roasted chana + a handful of peanuts, or a whey shake</td><td>~25 g</td></tr>
<tr><td>Dinner</td><td>Paneer/fish + sabzi + small millet portion</td><td>~35 g</td></tr>
</tbody>
</table>

<div class="callout">
<strong>Track it for one week.</strong> Most people badly misjudge their intake. Logging your protein (the Coach Himanshu habit tracker has a daily protein field) for even seven days shows you exactly where the gaps are.
</div>

<hr>

<h2>Do You Need Protein Powder?</h2>

<p>No -- whole foods can absolutely get you there. But a whey or plant protein scoop (~24 g) is a cheap, convenient way to close a gap, especially for vegetarians or on busy days. It is a <em>supplement</em>, not a requirement. Food first, powder to top up. For a deeper look, see our <a href="/blog/beginners-guide-to-protein-supplements-in-india">beginner's guide to protein supplements in India</a>.</p>

<hr>

<h2>Is Too Much Protein Dangerous?</h2>

<div class="callout-warning">
<strong>The kidney myth:</strong> In people with <em>healthy</em> kidneys, high-protein diets have not been shown to cause kidney damage. The concern applies to those with existing kidney disease, who should follow their doctor's advice. For everyone else, 1.6-2.2 g/kg is well within safe, well-studied limits.
</div>

<p>That said, more is not endlessly better. Beyond roughly 2.2 g/kg there is little extra muscle benefit for most people, and those calories are better spent elsewhere. Stay hydrated and get enough fibre, since high-protein diets can otherwise feel heavy.</p>

<hr>

<h2>What Changes When You Finally Eat Enough Protein</h2>

<table>
<thead>
<tr><th>Timeframe</th><th>What You Notice</th></tr>
</thead>
<tbody>
<tr><td>Week 1-2</td><td>Fewer cravings, more fullness between meals, steadier energy</td></tr>
<tr><td>Week 3-6</td><td>Better recovery, less muscle soreness, easier fat loss</td></tr>
<tr><td>Month 2-3</td><td>Visible muscle tone, strength gains, better body composition</td></tr>
</tbody>
</table>

<blockquote>Protein is the one nutrient almost everyone under-eats and almost no one regrets prioritising. Get it right and everything else -- fat loss, muscle, energy -- gets easier.</blockquote>

<hr>

<h2>Get a Protein Plan Built for You</h2>

<p><a href="/about">Coach Himanshu</a> builds personalised Indian meal plans that hit your exact protein target using foods you already eat -- vegetarian, eggetarian, or non-vegetarian -- without expensive supplements or bland "diet food." Every plan is matched to your goal, budget, and daily routine.</p>

<p><a href="/assessment">Take the free fitness assessment</a> to get a plan tailored to your body, or <a href="/plans">explore the coaching plans</a>. You may also like our guides on the <a href="/blog/best-diet-plan-for-muscle-building-in-india">best diet plan for muscle building</a>, <a href="/blog/indian-vegetarian-bodybuilding-complete-protein-workout-guide">Indian vegetarian bodybuilding</a>, and the <a href="/blog/best-pre-and-post-workout-meals-for-indian-diet">best pre and post workout meals</a> -- plus more on our <a href="/blog">fitness blog</a>.</p>

<hr>

<h2>Frequently Asked Questions</h2>

<h3>How much protein do I need per day to build muscle?</h3>
<p>To build muscle, aim for 1.6 to 2.2 grams of protein per kilogram of bodyweight per day. For a 70 kg person that is about 112 to 154 grams. Spread it across 3 to 4 meals of roughly 25 to 40 grams each, and combine it with progressive strength training -- protein builds muscle only when paired with the training stimulus.</p>

<h3>How much protein per day for weight loss?</h3>
<p>During weight loss, keep protein high -- around 1.8 to 2.2 g/kg -- even though you are eating fewer total calories. High protein preserves muscle while you lose fat, keeps you full so you eat less, and slightly increases the calories you burn through digestion. Cutting protein during a diet is a common mistake that leads to muscle loss and rebound weight gain.</p>

<h3>Can I get enough protein on a vegetarian Indian diet?</h3>
<p>Yes, absolutely. Build meals around soya chunks, paneer, tofu, dal, rajma, chana, curd, milk, and peanuts. Soya chunks are especially protein-dense and affordable. Because plant proteins are less concentrated than meat, vegetarians simply need larger and more deliberate portions -- and combining sources through the day (like dal with rice, or rajma with roti) easily covers all essential amino acids.</p>

<h3>How much protein is in one katori of dal?</h3>
<p>One katori (about one cup) of cooked dal contains only around 7 to 8 grams of protein -- much less than most people assume. Dal is a healthy protein source, but you cannot rely on it alone to meet your daily target. Pair it with curd, paneer, soya, eggs, or chicken to build a genuinely high-protein plate.</p>

<h3>Is too much protein bad for your kidneys?</h3>
<p>For people with healthy kidneys, high-protein diets in the 1.6 to 2.2 g/kg range have not been shown to cause kidney damage. The caution applies specifically to those with pre-existing kidney disease, who should follow medical advice. For healthy, active adults, this protein range is safe and well studied -- just stay well hydrated and eat enough fibre.</p>

<h3>Do I need protein powder to hit my target?</h3>
<p>No. Whole foods like eggs, chicken, paneer, soya, dal, and curd can fully meet your protein needs. Protein powder is simply a convenient, affordable way to close a gap on busy days or for vegetarians who find it hard to reach their number through food alone. Treat it as a top-up, not a requirement -- food first, powder second.</p>

<hr>

<p><em>Your protein target is the highest-leverage change you can make to your diet. Calculate your number, anchor every meal with protein, and track it for a week. For a plan that hits it automatically with foods you love, <a href="/assessment">take the free assessment</a> or explore more on the <a href="/knowledge">knowledge hub</a>.</em></p>`,
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

  console.log('\nDone! SEO blog post (batch 8) has been seeded/updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
