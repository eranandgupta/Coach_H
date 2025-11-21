import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch latest published blog post
export async function GET() {
  try {
    const latestPost = await prisma.blogPost.findFirst({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    if (!latestPost) {
      return NextResponse.json({ post: null });
    }

    return NextResponse.json(latestPost);
  } catch (error) {
    console.error('Error fetching latest blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest blog post' },
      { status: 500 }
    );
  }
}
