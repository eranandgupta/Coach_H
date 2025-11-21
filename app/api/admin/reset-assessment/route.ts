import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST - Reset assessment for a user by email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find and update the user
    const user = await prisma.user.update({
      where: { email },
      data: { assessmentCompleted: false },
      select: {
        email: true,
        role: true,
        assessmentCompleted: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Assessment reset for ${email}`,
      user,
    }, { status: 200 });

  } catch (error) {
    console.error('Reset assessment error:', error);
    return NextResponse.json(
      { error: 'User not found or error resetting assessment' },
      { status: 500 }
    );
  }
}

// GET - Check all clients assessment status
export async function GET(request: NextRequest) {
  try {
    const clients = await prisma.user.findMany({
      where: {
        role: { not: 'coach' },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        assessmentCompleted: true,
      },
    });

    return NextResponse.json({
      success: true,
      clients,
    }, { status: 200 });

  } catch (error) {
    console.error('Get clients error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
