const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetClientAssessment() {
  try {
    // Update all non-coach users to have assessmentCompleted = false
    const result = await prisma.user.updateMany({
      where: {
        role: { not: 'coach' },
      },
      data: {
        assessmentCompleted: false,
      },
    });

    console.log(`✅ Reset assessment status for ${result.count} client(s)`);

    // Show current status
    const clients = await prisma.user.findMany({
      where: {
        role: { not: 'coach' },
      },
      select: {
        email: true,
        assessmentCompleted: true,
      },
    });

    console.log('\n📋 Current client assessment status:');
    clients.forEach(client => {
      console.log(`  - ${client.email}: ${client.assessmentCompleted ? '✓ Completed' : '✗ Not Completed'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetClientAssessment();
