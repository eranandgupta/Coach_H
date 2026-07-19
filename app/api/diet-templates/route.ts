import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoachOrTrainer } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

// Empty string / null -> null; otherwise a parsed float (shared by POST/PUT).
function parseDecimal(value: any) {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// Map incoming meal rows to Prisma create input (shared by POST/PUT).
function mapMeals(meals: any[] | undefined) {
  if (!meals) return undefined;
  return {
    create: meals.map((meal: any, index: number) => ({
      name: meal.name,
      description: meal.description || null,
      mealType: meal.mealType,
      calories: meal.calories ? parseInt(meal.calories) : null,
      protein: parseDecimal(meal.protein),
      carbs: parseDecimal(meal.carbs),
      fats: parseDecimal(meal.fats),
      ingredients: meal.ingredients || null,
      instructions: meal.instructions || null,
      alternatives: meal.alternatives || null,
      day: meal.day,
      time: meal.time || null,
      order: meal.order || index,
    })),
  };
}

// GET diet templates visible to this user: their own + any shared ones.
async function getHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;

    const templates = await prisma.dietTemplate.findMany({
      where: {
        OR: [{ createdById: user.userId }, { isShared: true }],
      },
      include: {
        meals: { orderBy: { order: 'asc' } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error('Get diet templates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new diet template (no client / dates / week).
async function postHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const body = await request.json();
    const { name, description, notes, targetCalories, isShared, meals } = body;

    if (!name) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
    }

    const template = await prisma.dietTemplate.create({
      data: {
        name,
        description: description || null,
        notes: notes || null,
        targetCalories: targetCalories ? parseInt(targetCalories) : null,
        isShared: !!isShared,
        createdById: user.userId,
        meals: mapMeals(meals),
      },
      include: { meals: true },
    });

    return NextResponse.json(
      { message: 'Diet template created successfully', template },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create diet template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update a diet template — only the creator may edit.
async function putHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const body = await request.json();
    const { id, name, description, notes, targetCalories, isShared, meals } = body;

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const existing = await prisma.dietTemplate.findFirst({
      where: { id: parseInt(id), createdById: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Template not found or unauthorized' }, { status: 404 });
    }

    if (meals) {
      await prisma.templateMeal.deleteMany({
        where: { dietTemplateId: parseInt(id) },
      });
    }

    const template = await prisma.dietTemplate.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existing.name,
        description: description !== undefined ? description || null : existing.description,
        notes: notes !== undefined ? notes || null : existing.notes,
        targetCalories:
          targetCalories !== undefined
            ? targetCalories
              ? parseInt(targetCalories)
              : null
            : existing.targetCalories,
        isShared: isShared !== undefined ? !!isShared : existing.isShared,
        meals: mapMeals(meals),
      },
      include: { meals: true },
    });

    return NextResponse.json(
      { message: 'Diet template updated successfully', template },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update diet template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a diet template — only the creator may delete.
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const existing = await prisma.dietTemplate.findFirst({
      where: { id: parseInt(id), createdById: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Template not found or unauthorized' }, { status: 404 });
    }

    await prisma.dietTemplate.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: 'Diet template deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete diet template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireCoachOrTrainer(getHandler);
export const POST = requireCoachOrTrainer(postHandler);
export const PUT = requireCoachOrTrainer(putHandler);
export const DELETE = requireCoachOrTrainer(deleteHandler);
