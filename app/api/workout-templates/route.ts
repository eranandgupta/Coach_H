import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoachOrTrainer } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// Map incoming exercise rows to Prisma create input (shared by POST/PUT).
function mapExercises(exercises: any[] | undefined) {
  if (!exercises) return undefined;
  return {
    create: exercises.map((ex: any, index: number) => ({
      name: ex.name,
      description: ex.description || null,
      sets: ex.sets ? parseInt(ex.sets) : null,
      reps: ex.reps || null,
      duration: ex.duration ? parseInt(ex.duration) : null,
      restTime: ex.restTime ? parseInt(ex.restTime) : null,
      videoUrl: ex.videoUrl || null,
      day: ex.day,
      order: ex.order || index,
      exerciseType: ex.exerciseType || 'normal',
      supersetGroup: ex.supersetGroup ? parseInt(ex.supersetGroup) : null,
    })),
  };
}

// GET workout templates visible to this user: their own + any shared ones.
async function getHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;

    const templates = await prisma.workoutTemplate.findMany({
      where: {
        OR: [{ createdById: user.userId }, { isShared: true }],
      },
      include: {
        exercises: { orderBy: { order: 'asc' } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error('Get workout templates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new workout template (no client / dates / week).
async function postHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const body = await request.json();
    const { name, description, notes, isShared, exercises } = body;

    if (!name) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
    }

    const template = await prisma.workoutTemplate.create({
      data: {
        name,
        description: description || null,
        notes: notes || null,
        isShared: !!isShared,
        createdById: user.userId,
        exercises: mapExercises(exercises),
      },
      include: { exercises: true },
    });

    return NextResponse.json(
      { message: 'Workout template created successfully', template },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create workout template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update a workout template — only the creator may edit.
async function putHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const body = await request.json();
    const { id, name, description, notes, isShared, exercises } = body;

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const existing = await prisma.workoutTemplate.findFirst({
      where: { id: parseInt(id), createdById: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Template not found or unauthorized' }, { status: 404 });
    }

    if (exercises) {
      await prisma.templateExercise.deleteMany({
        where: { workoutTemplateId: parseInt(id) },
      });
    }

    const template = await prisma.workoutTemplate.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existing.name,
        description: description !== undefined ? description || null : existing.description,
        notes: notes !== undefined ? notes || null : existing.notes,
        isShared: isShared !== undefined ? !!isShared : existing.isShared,
        exercises: mapExercises(exercises),
      },
      include: { exercises: true },
    });

    return NextResponse.json(
      { message: 'Workout template updated successfully', template },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update workout template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a workout template — only the creator may delete.
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const existing = await prisma.workoutTemplate.findFirst({
      where: { id: parseInt(id), createdById: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Template not found or unauthorized' }, { status: 404 });
    }

    await prisma.workoutTemplate.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: 'Workout template deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete workout template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireCoachOrTrainer(getHandler);
export const POST = requireCoachOrTrainer(postHandler);
export const PUT = requireCoachOrTrainer(putHandler);
export const DELETE = requireCoachOrTrainer(deleteHandler);
