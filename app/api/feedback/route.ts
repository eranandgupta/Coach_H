import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

// POST - Submit new feedback
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const location = formData.get('location') as string;
    const phone = formData.get('phone') as string;
    const rating = formData.get('rating') as string;
    const review = formData.get('review') as string;
    const transformation = formData.get('transformation') as string;

    const profilePhoto = formData.get('profilePhoto') as File | null;
    const beforePhoto = formData.get('beforePhoto') as File | null;
    const afterPhoto = formData.get('afterPhoto') as File | null;

    // Validate required fields
    if (!name || !email || !location || !rating || !review) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate rating (1-5)
    const ratingNum = parseInt(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'feedback');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Helper function to save and compress file
    const saveFile = async (file: File, prefix: string) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const fileName = `${prefix}_${timestamp}.webp`; // Always save as WebP for better compression
      const filePath = join(uploadsDir, fileName);

      // Compress and resize image using sharp
      await sharp(buffer)
        .resize(800, 800, {
          fit: 'inside', // Maintain aspect ratio
          withoutEnlargement: true, // Don't enlarge smaller images
        })
        .webp({
          quality: 75, // Good balance between quality and size
          effort: 6, // Compression effort (0-6, higher = better compression)
        })
        .toFile(filePath);

      return `/uploads/feedback/${fileName}`;
    };

    // Save uploaded files
    let profilePhotoUrl = null;
    let beforePhotoUrl = null;
    let afterPhotoUrl = null;

    if (profilePhoto && profilePhoto.size > 0) {
      profilePhotoUrl = await saveFile(profilePhoto, 'profile');
    }

    if (beforePhoto && beforePhoto.size > 0) {
      beforePhotoUrl = await saveFile(beforePhoto, 'before');
    }

    if (afterPhoto && afterPhoto.size > 0) {
      afterPhotoUrl = await saveFile(afterPhoto, 'after');
    }

    // Save to database
    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        location,
        phone: phone || null,
        rating: ratingNum,
        review,
        transformation: transformation || null,
        profilePhoto: profilePhotoUrl,
        beforePhoto: beforePhotoUrl,
        afterPhoto: afterPhotoUrl,
        isApproved: false, // Needs coach approval
        isVisible: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your feedback! It will be reviewed and published soon.',
        feedbackId: feedback.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Fetch approved and visible feedbacks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    const feedbacks = await prisma.feedback.findMany({
      where: {
        isApproved: true,
        isVisible: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
      select: {
        id: true,
        name: true,
        location: true,
        rating: true,
        review: true,
        transformation: true,
        profilePhoto: true,
        beforePhoto: true,
        afterPhoto: true,
        createdAt: true,
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
    console.error('Feedback fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}
