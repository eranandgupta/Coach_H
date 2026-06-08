import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach, requireCoachOrTrainer } from '@/lib/middleware';


export const dynamic = 'force-dynamic';
// GET all diet plans (coach can see all their created plans)
async function getHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;

    // Trainers see only assigned clients' diets; coaches see their own
    let whereClause: any = { coachId: user.userId };
    if (user.role === 'trainer') {
      const assignments = await prisma.trainerClient.findMany({
        where: { trainerId: user.userId },
        select: { clientId: true },
      });
      const assignedIds = assignments.map((a) => a.clientId);
      whereClause = assignedIds.length > 0 ? { clientId: { in: assignedIds } } : { id: -1 };
    }

    const diets = await prisma.dietPlan.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: user.role !== 'trainer',
          },
        },
        meals: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ diets }, { status: 200 });
  } catch (error) {
    console.error('Get diets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new diet plan (coach only)
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
      targetCalories,
      notes,
      meals,
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

    // Helper function to parse decimal values (empty string -> null)
    const parseDecimal = (value: any) => {
      if (value === '' || value === null || value === undefined) return null;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    };

    // Create diet plan with meals
    const diet = await prisma.dietPlan.create({
      data: {
        title,
        description: description || null,
        clientId: parseInt(clientId),
        coachId: user.userId,
        weekNumber: parseInt(weekNumber),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCalories: targetCalories ? parseInt(targetCalories) : null,
        notes: notes || null,
        meals: meals
          ? {
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
            }
          : undefined,
      },
      include: {
        meals: true,
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
        message: 'Diet plan created successfully',
        diet,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create diet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update a diet plan
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
      targetCalories,
      notes,
      meals,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Diet ID is required' },
        { status: 400 }
      );
    }

    // Check if diet exists (trainers can edit any, coaches only their own)
    const existingDiet = await prisma.dietPlan.findFirst({
      where: user.role === 'trainer'
        ? { id: parseInt(id) }
        : { id: parseInt(id), coachId: user.userId },
    });

    if (!existingDiet) {
      return NextResponse.json(
        { error: 'Diet not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete existing meals if new ones are provided
    if (meals) {
      await prisma.meal.deleteMany({
        where: { dietPlanId: parseInt(id) },
      });
    }

    // Helper function to parse decimal values (empty string -> null)
    const parseDecimal = (value: any) => {
      if (value === '' || value === null || value === undefined) return null;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    };

    // Update diet plan
    const updatedDiet = await prisma.dietPlan.update({
      where: { id: parseInt(id) },
      data: {
        title: title || existingDiet.title,
        description: description !== undefined ? (description || null) : existingDiet.description,
        weekNumber: weekNumber ? parseInt(weekNumber) : existingDiet.weekNumber,
        startDate: startDate ? new Date(startDate) : existingDiet.startDate,
        endDate: endDate ? new Date(endDate) : existingDiet.endDate,
        targetCalories: targetCalories !== undefined ? (targetCalories ? parseInt(targetCalories) : null) : existingDiet.targetCalories,
        notes: notes !== undefined ? (notes || null) : existingDiet.notes,
        meals: meals
          ? {
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
            }
          : undefined,
      },
      include: {
        meals: true,
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
        message: 'Diet plan updated successfully',
        diet: updatedDiet,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update diet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a diet plan
async function deleteHandler(request: NextRequest, context: any) {
  try {
    const { user } = context;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Diet ID is required' },
        { status: 400 }
      );
    }

    // Check if diet exists and belongs to this coach
    const existingDiet = await prisma.dietPlan.findFirst({
      where: {
        id: parseInt(id),
        coachId: user.userId,
      },
    });

    if (!existingDiet) {
      return NextResponse.json(
        { error: 'Diet not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete diet (meals will be deleted via cascade)
    await prisma.dietPlan.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Diet plan deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete diet error:', error);
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
