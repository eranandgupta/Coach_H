import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendCredentialsEmail } from '@/lib/email';
import { hashPassword } from '@/lib/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'coachhimanshu-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Verify coach authentication
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const coach = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!coach || coach.role !== 'coach') {
      return NextResponse.json(
        { error: 'Unauthorized - Coach access required' },
        { status: 403 }
      );
    }

    // Get client ID from request
    const body = await request.json();
    const { clientId } = body;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Fetch client data
    const client = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Generate a new temporary password
    // Format: 8 alphanumeric characters (mix of lowercase, uppercase, and numbers)
    const tempPassword =
      Math.random().toString(36).slice(-4) +
      Math.random().toString(36).slice(-4).toUpperCase() +
      Math.floor(Math.random() * 1000);

    // Hash the new password
    const hashedPassword = await hashPassword(tempPassword);

    // Update the user's password in database
    await prisma.user.update({
      where: { id: clientId },
      data: { password: hashedPassword },
    });

    // Send email with new credentials
    await sendCredentialsEmail({
      clientName: client.name || 'Client',
      clientEmail: client.email,
      password: tempPassword,
    });

    return NextResponse.json({
      success: true,
      message: `New credentials sent successfully to ${client.email}. The client's password has been reset.`,
    });
  } catch (error) {
    console.error('Error sending credentials:', error);
    return NextResponse.json(
      { error: 'Failed to send credentials' },
      { status: 500 }
    );
  }
}
