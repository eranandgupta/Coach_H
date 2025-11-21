import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach } from '@/lib/middleware';


export const dynamic = 'force-dynamic';
// GET all workout plans (coach can see all their created plans)
async function getHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;

    const workouts = await prisma.workoutPlan.findMany({
      where: {
        coachId: user.userId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        exercises: {
          orderBy: [{ day: 'asc' }, { order: 'asc' }],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ workouts }, { status: 200 });
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

export const GET = requireCoach(getHandler);
export const POST = requireCoach(postHandler);
export const PUT = requireCoach(putHandler);
export const DELETE = requireCoach(deleteHandler);
