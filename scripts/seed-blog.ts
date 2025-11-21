import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find the coach user (assuming there's at least one coach)
  const coach = await prisma.user.findFirst({
    where: { role: 'coach' },
  });

  if (!coach) {
    console.log('No coach user found. Please create a coach user first.');
    return;
  }

  // Create the sample blog post
  const blogPost = await prisma.blogPost.create({
    data: {
      title: 'Walking vs Running – Which One Should You Choose?',
      slug: 'walking-vs-running-which-one-should-you-choose',
      excerpt: 'When it comes to staying active, two of the most common choices are walking and running. Both are excellent forms of exercise, but they affect your body differently. Let\'s break it down scientifically so you can make the smartest choice for your goals.',
      content: `
<h2>❤️ Heart Health & Cardiovascular Benefits</h2>
<p>Walking and running both strengthen your heart and improve blood circulation. Walking at a brisk pace increases heart rate moderately, helping lower blood pressure and reduce the risk of heart disease. Running, however, challenges your cardiovascular system more intensely, boosting VO₂ max (a measure of how well your body uses oxygen) and improving endurance over time ⚡.</p>

<h2>🔥 Calorie Burn & Weight Management</h2>
<p>If your main goal is calorie burn, running has the edge. A 30-minute run can burn roughly 50–70% more calories than the same duration of brisk walking. However, walking consistently throughout the day can also contribute significantly to your total daily energy expenditure, especially for long-term fat loss.</p>

<h2>🦴 Joint Health & Injury Risk</h2>
<p>Walking is low-impact, making it gentle on knees, hips, and ankles. It's ideal for beginners, older adults, or anyone recovering from injury. Running, while more intense, is high-impact and can strain joints if not done with proper technique or footwear.</p>

<h2>🧘 Mental Health & Stress Relief</h2>
<p>Both activities release endorphins – the feel-good hormones. Walking allows for mindfulness, stress relief, and even social interaction if you walk with a friend. Running releases a higher intensity of endorphins, often leading to the famous "runner's high" 💨.</p>

<h2>🏃 Consistency & Lifestyle Fit</h2>
<p>Here's the key: the best exercise is the one you can do consistently. Walking is sustainable daily, easy to fit into your routine, and less intimidating. Running is powerful for improving performance, stamina, and calorie burn but may require careful planning to avoid burnout or injury.</p>

<h2>✅ The Smart Approach: Combine Both</h2>
<p>For optimal results, mix walking and running. Use walking for active recovery, daily movement, and stress management 🚶‍♂. Incorporate running for intensity, calorie burn, and endurance 🏃. This balance strengthens your heart, keeps joints healthy, and boosts both physical and mental well-being 💯.</p>

<h2>📝 Bottom Line</h2>
<p>Whether you choose walking or running depends on your goals, fitness level, and lifestyle. Walking is your sustainable, joint-friendly companion, while running challenges your body for faster results. Mix them wisely, and you'll get the best of both worlds!</p>
      `,
      authorId: coach.id,
      published: true,
      publishedAt: new Date('2025-10-03'),
      readTime: 5,
    },
  });

  console.log('Sample blog post created:', blogPost);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
