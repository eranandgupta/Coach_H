import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';
import { checkSubscription } from '@/lib/middleware';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Login attempt started');
    const body = await request.json();
    const { email, password } = body;
    console.log('Login attempt for email:', email);

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    console.log('Finding user in database...');
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Verifying password...');
    const isPasswordValid = await comparePassword(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    console.log('Generating token...');
    const token = generateToken(user.id, user.email, user.role);
    console.log('Token generated');

    // Check subscription status (only for regular users, not coaches)
    let subscriptionStatus = null;
    if (user.role !== 'coach') {
      console.log('Checking subscription status...');
      subscriptionStatus = await checkSubscription(user.id);
      console.log('Subscription status:', subscriptionStatus);
    }

    // Return user data (without password)
    console.log('Login successful, returning data');
    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          image: user.image,
          role: user.role,
          assessmentCompleted: user.assessmentCompleted,
          createdAt: user.createdAt.toISOString(),
        },
        subscription: subscriptionStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
