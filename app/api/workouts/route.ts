import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach, requireCoachOrTrainer } from '@/lib/middleware';


export const dynamic = 'force-dynamic';
// GET all workout plans (coach can see all their created plans)
async function getHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;

    // Trainers see only assigned clients' workouts; coaches see all (own + trainer-created)
    let whereClause: any = { coachId: user.userId };
    if (user.role === 'trainer') {
      const assignments = await prisma.trainerClient.findMany({
        where: { trainerId: user.userId },
        select: { clientId: true },
      });
      const assignedIds = assignments.map((a) => a.clientId);
      whereClause = assignedIds.length > 0 ? { clientId: { in: assignedIds } } : { id: -1 };
    }

    const workouts = await prisma.workoutPlan.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: user.role !== 'trainer',
          },
        },
        coach: {
          select: {
            id: true,
            name: true,
          },
        },
        exercises: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // For coach: also fetch workouts created by trainers for assigned clients
    let trainerWorkouts: typeof workouts = [];
    if (user.role === 'coach' || user.role === 'admin') {
      const trainerAssignments = await prisma.trainerClient.findMany({
        where: { assignedBy: user.userId },
        select: { clientId: true, trainerId: true },
      });
      if (trainerAssignments.length > 0) {
        const trainerClientIds = trainerAssignments.map((a) => a.clientId);
        trainerWorkouts = await prisma.workoutPlan.findMany({
          where: {
            clientId: { in: trainerClientIds },
            coachId: { not: user.userId },
          },
          include: {
            client: {
              select: { id: true, name: true, email: true },
            },
            coach: {
              select: { id: true, name: true },
            },
            exercises: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    }

    // Merge and deduplicate
    const allWorkouts = [...workouts, ...trainerWorkouts];

    return NextResponse.json({ workouts: allWorkouts }, { status: 200 });
  } catch (error) {
    console.error('Get workouts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new workout plan (coach only)
async function postHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const body = await request.json();
    const {
      title,
      description,
      clientId,
      weekNumber,
      startDate,
      endDate,
      notes,
      exercises,
    } = body;

    // Validate required fields
    if (!title || !clientId || !weekNumber || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Title, client, week number, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id: parseInt(clientId) },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Create workout plan with exercises
    const workout = await prisma.workoutPlan.create({
      data: {
        title,
        description,
        clientId: parseInt(clientId),
        coachId: user.userId,
        weekNumber: parseInt(weekNumber),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes,
        exercises: exercises
          ? {
              create: exercises.map((ex: any, index: number) => ({
                name: ex.name,
                description: ex.description,
                sets: ex.sets ? parseInt(ex.sets) : null,
                reps: ex.reps,
                duration: ex.duration ? parseInt(ex.duration) : null,
                restTime: ex.restTime ? parseInt(ex.restTime) : null,
                videoUrl: ex.videoUrl,
                day: ex.day,
                order: ex.order || index,
                exerciseType: ex.exerciseType || 'normal',
                supersetGroup: ex.supersetGroup ? parseInt(ex.supersetGroup) : null,
              })),
            }
          : undefined,
      },
      include: {
        exercises: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Workout plan created successfully',
        workout,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create workout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update a workout plan
async function putHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const body = await request.json();
    const {
      id,
      title,
      description,
      weekNumber,
      startDate,
      endDate,
      notes,
      exercises,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Workout ID is required' },
        { status: 400 }
      );
    }

    // Check if workout exists (trainers can edit any, coaches only their own)
    const existingWorkout = await prisma.workoutPlan.findFirst({
      where: user.role === 'trainer'
        ? { id: parseInt(id) }
        : { id: parseInt(id), coachId: user.userId },
    });

    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete existing exercises if new ones are provided
    if (exercises) {
      await prisma.exercise.deleteMany({
        where: { workoutPlanId: parseInt(id) },
      });
    }

    // Update workout plan
    const updatedWorkout = await prisma.workoutPlan.update({
      where: { id: parseInt(id) },
      data: {
        title: title || existingWorkout.title,
        description: description !== undefined ? description : existingWorkout.description,
        weekNumber: weekNumber ? parseInt(weekNumber) : existingWorkout.weekNumber,
        startDate: startDate ? new Date(startDate) : existingWorkout.startDate,
        endDate: endDate ? new Date(endDate) : existingWorkout.endDate,
        notes: notes !== undefined ? notes : existingWorkout.notes,
        exercises: exercises
          ? {
              create: exercises.map((ex: any, index: number) => ({
                name: ex.name,
                description: ex.description,
                sets: ex.sets ? parseInt(ex.sets) : null,
                reps: ex.reps,
                duration: ex.duration ? parseInt(ex.duration) : null,
                restTime: ex.restTime ? parseInt(ex.restTime) : null,
                videoUrl: ex.videoUrl,
                day: ex.day,
                order: ex.order || index,
                exerciseType: ex.exerciseType || 'normal',
                supersetGroup: ex.supersetGroup ? parseInt(ex.supersetGroup) : null,
              })),
            }
          : undefined,
      },
      include: {
        exercises: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Workout plan updated successfully',
        workout: updatedWorkout,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update workout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a workout plan
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Workout ID is required' },
        { status: 400 }
      );
    }

    // Check if workout exists and belongs to this coach
    const existingWorkout = await prisma.workoutPlan.findFirst({
      where: {
        id: parseInt(id),
        coachId: user.userId,
      },
    });

    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete workout (exercises will be deleted via cascade)
    await prisma.workoutPlan.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Workout plan deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete workout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireCoachOrTrainer(getHandler);
export const POST = requireCoachOrTrainer(postHandler);
export const PUT = requireCoachOrTrainer(putHandler);
export const DELETE = requireCoach(deleteHandler);
