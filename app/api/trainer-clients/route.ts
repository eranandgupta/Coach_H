import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach, requireCoachOrTrainer } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// GET - Fetch trainer-client assignments
// Coach sees all assignments; trainer sees only their own
async function getHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get('trainerId');

    const where: any = {};
    if (user.role === 'trainer') {
      where.trainerId = user.userId;
    } else if (trainerId) {
      where.trainerId = parseInt(trainerId);
    }

    const assignments = await prisma.trainerClient.findMany({
      where,
      include: {
        trainer: { select: { id: true, name: true, image: true } },
        client: {
          select: {
            id: true,
            name: true,
            image: true,
            subscriptions: {
              include: { plan: true },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ assignments }, { status: 200 });
  } catch (error) {
    console.error('Get trainer-client assignments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Assign client to trainer (coach only)
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const { trainerId, clientId } = body;

    if (!trainerId || !clientId) {
      return NextResponse.json({ error: 'trainerId and clientId are required' }, { status: 400 });
    }

    // Verify trainer exists and has trainer role
    const trainer = await prisma.user.findUnique({ where: { id: parseInt(trainerId) } });
    if (!trainer || trainer.role !== 'trainer') {
      return NextResponse.json({ error: 'Invalid trainer' }, { status: 400 });
    }

    // Verify client exists and has user role
    const client = await prisma.user.findUnique({ where: { id: parseInt(clientId) } });
    if (!client || client.role !== 'user') {
      return NextResponse.json({ error: 'Invalid client' }, { status: 400 });
    }

    // Verify client has an active Elite 1:1 subscription
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: parseInt(clientId),
        OR: [
          { endDate: { gte: new Date() } },
          { status: 'active' },
        ],
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription || !subscription.plan.name.startsWith('Elite 1:1')) {
      return NextResponse.json({ error: 'Only Elite 1:1 clients can be assigned to a trainer' }, { status: 400 });
    }

    // Check if already assigned
    const existing = await prisma.trainerClient.findUnique({
      where: { trainerId_clientId: { trainerId: parseInt(trainerId), clientId: parseInt(clientId) } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Client is already assigned to this trainer' }, { status: 400 });
    }

    const assignment = await prisma.trainerClient.create({
      data: {
        trainerId: parseInt(trainerId),
        clientId: parseInt(clientId),
        assignedBy: context.user.userId,
      },
      include: {
        trainer: { select: { id: true, name: true, image: true } },
        client: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    console.error('Assign client to trainer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Unassign client from trainer (coach only)
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get('trainerId');
    const clientId = searchParams.get('clientId');

    if (!trainerId || !clientId) {
      return NextResponse.json({ error: 'trainerId and clientId are required' }, { status: 400 });
    }

    const existing = await prisma.trainerClient.findUnique({
      where: { trainerId_clientId: { trainerId: parseInt(trainerId), clientId: parseInt(clientId) } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    await prisma.trainerClient.delete({
      where: { trainerId_clientId: { trainerId: parseInt(trainerId), clientId: parseInt(clientId) } },
    });

    // Also delete the trainer-client conversation if exists
    await prisma.conversation.deleteMany({
      where: { trainerId: parseInt(trainerId), clientId: parseInt(clientId) },
    });

    return NextResponse.json({ message: 'Client unassigned successfully' }, { status: 200 });
  } catch (error) {
    console.error('Unassign client from trainer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireCoachOrTrainer(getHandler);
export const POST = requireCoach(postHandler);
export const DELETE = requireCoach(deleteHandler);
