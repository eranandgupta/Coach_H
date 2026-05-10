import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.TRAINER_EMAIL || 'trainer@coachhimanshu.com';
  const password = process.env.TRAINER_PASSWORD;
  const name = 'Trainer';

  if (!password) {
    console.error('Error: TRAINER_PASSWORD environment variable is required.');
    console.error('Usage: TRAINER_PASSWORD=yourpassword npx tsx scripts/create-trainer.ts');
    process.exit(1);
  }

  // Check if trainer already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Trainer user already exists. Updating role to trainer...');
    await prisma.user.update({
      where: { email },
      data: { role: 'trainer' },
    });
    console.log('Trainer role updated.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const trainer = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'trainer',
      assessmentCompleted: true,
    },
  });

  console.log('Trainer created successfully:');
  console.log(`  Email: ${email}`);
  console.log(`  ID: ${trainer.id}`);
}

main()
  .catch((e) => {
    console.error('Error creating trainer:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
