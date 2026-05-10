import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'trainer@coachhimanshu.com';
  const password = 'Trainer@123';
  const name = 'Trainer';

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
  console.log(`  Password: ${password}`);
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
