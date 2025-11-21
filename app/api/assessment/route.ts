import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST - Submit assessment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...assessmentData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects
    if (assessmentData.dateOfBirth) {
      assessmentData.dateOfBirth = new Date(assessmentData.dateOfBirth);
    }

    // Convert string numbers to proper types
    const numericFields = ['height', 'weight', 'fatPercentage'];
    numericFields.forEach(field => {
      if (assessmentData[field] !== undefined && assessmentData[field] !== '') {
        assessmentData[field] = parseFloat(assessmentData[field]);
      } else {
        delete assessmentData[field];
      }
    });

    // Create or update assessment
    const assessment = await prisma.clientAssessment.upsert({
      where: { userId: parseInt(userId) },
      update: assessmentData,
      create: {
        userId: parseInt(userId),
        ...assessmentData,
      },
    });

    // Update user's assessmentCompleted flag
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { assessmentCompleted: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      assessment,
    }, { status: 200 });

  } catch (error) {
    console.error('Submit assessment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get user's assessment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const assessment = await prisma.clientAssessment.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      assessment,
    }, { status: 200 });

  } catch (error) {
    console.error('Get assessment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
