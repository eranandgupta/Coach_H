import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireCoachOrAdmin } from '@/lib/middleware';
import { sendCredentialsEmail } from '@/lib/email';
import { resolveTrainerPermissions, sanitizeTrainerPermissions } from '@/lib/trainerPermissions';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const trainerSelect = { id: true, name: true, email: true, phone: true, image: true, trainerPermissions: true } as const;
const withPermissions = (t: any) => ({ ...t, trainerPermissions: resolveTrainerPermissions(t.trainerPermissions) });

async function getHandler(request: NextRequest, context: any) {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: 'trainer' },
      select: trainerSelect,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ trainers: trainers.map(withPermissions) }, { status: 200 });
  } catch (error) {
    console.error('Get trainers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a trainer account with its access options
async function postHandler(request: NextRequest, context: any) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim() || null;
    const password = String(body.password || '');

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    if (await prisma.user.findUnique({ where: { email } })) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const trainer = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
        role: 'trainer',
        trainerPermissions: sanitizeTrainerPermissions(body.permissions),
      },
      select: trainerSelect,
    });

    let emailSent = false;
    if (body.sendEmail) {
      try {
        await sendCredentialsEmail({ clientName: name, clientEmail: email, password });
        emailSent = true;
      } catch (err) {
        console.error('Trainer credentials email failed (non-fatal):', err);
      }
    }

    console.log(`Trainer ${trainer.id} created by user ${context.user.userId}`);
    return NextResponse.json({ trainer: withPermissions(trainer), emailSent }, { status: 201 });
  } catch (error) {
    console.error('Create trainer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a trainer's name, email, password and/or access options
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

    if (typeof body.name === 'string') {
      const name = body.name.trim();
      if (!name) return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
      if (name !== trainer.name) updateData.name = name;
    }

    if (email && email !== trainer.email) {
      if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
      }
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

    if (body.permissions !== undefined) {
      updateData.trainerPermissions = sanitizeTrainerPermissions(body.permissions);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    const updatedTrainer = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: trainerSelect,
    });

    return NextResponse.json({ trainer: withPermissions(updatedTrainer) }, { status: 200 });
  } catch (error) {
    console.error('Update trainer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const GET = requireCoachOrAdmin(getHandler);
export const POST = requireCoachOrAdmin(postHandler);
export const PUT = requireCoachOrAdmin(putHandler);
