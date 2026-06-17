import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoach } from '@/lib/middleware';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

async function getHandler(request: NextRequest, context: any) {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: 'trainer' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ trainers }, { status: 200 });
  } catch (error) {
    console.error('Get trainers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function putHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const { id, email, password } = body;

    if (!id) {
      return NextResponse.json({ error: 'Trainer ID is required' }, { status: 400 });
    }

    const trainer = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!trainer || trainer.role !== 'trainer') {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (email && email !== trainer.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
      updateData.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    const updatedTrainer = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({ trainer: updatedTrainer }, { status: 200 });
  } catch (error) {
    console.error('Update trainer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireCoach(getHandler);
export const PUT = requireCoach(putHandler);
