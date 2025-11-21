import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all feedbacks (for admin)
export async function GET(request: NextRequest) {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        feedbacks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin feedback fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}

// PATCH - Update feedback (approve, hide/show, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isApproved, isVisible } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof isApproved !== 'undefined') updateData.isApproved = isApproved;
    if (typeof isVisible !== 'undefined') updateData.isVisible = isVisible;

    const feedback = await prisma.feedback.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        feedback,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin feedback update error:', error);
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
}

// DELETE - Delete feedback
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    await prisma.feedback.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin feedback delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete feedback' },
      { status: 500 }
    );
  }
}
