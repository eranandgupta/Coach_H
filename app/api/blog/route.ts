import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/middleware';
import { sendPushToAllClients } from '@/lib/push';

// GET - Fetch all blog posts (published for public, all for coach)
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    const isCoach = authUser?.role?.toLowerCase() === 'coach';

    const posts = await prisma.blogPost.findMany({
      where: isCoach ? {} : { published: true },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new blog post (coach only)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      console.error('Blog creation failed: No auth user');
      return NextResponse.json({ error: 'Unauthorized. Please log in again.' }, { status: 401 });
    }

    // Case-insensitive role check to handle 'coach', 'Coach', 'COACH'
    const userRole = authUser.role?.toLowerCase();
    if (userRole !== 'coach') {
      console.error(`Blog creation failed: User role is '${authUser.role}', expected 'coach'`);
      return NextResponse.json({
        error: 'Only coaches can create blog posts. Your current role is: ' + authUser.role
      }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, videoUrl, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Trim whitespace from content
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate read time (average reading speed: 200 words per minute)
    const wordCount = trimmedContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    console.log(`Creating blog post: "${title}" by user ${authUser.userId} (${authUser.email})`);

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug,
        content: trimmedContent,
        excerpt: excerpt?.trim() || null,
        coverImage: coverImage?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        authorId: authUser.userId,
        published: published || false,
        publishedAt: published ? new Date() : null,
        readTime,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Send push notification if blog is published
    if (published) {
      try {
        await sendPushToAllClients({
          title: '📰 New Blog Post',
          body: excerpt || title,
          icon: coverImage || '/icon-192x192.png',
          badge: '/icon-192x192.png',
          tag: 'blog',
          url: `/blog/${slug}`,
        });
        console.log(`Push notifications sent for blog post: ${slug}`);
      } catch (pushError) {
        console.error('Failed to send push notifications for blog:', pushError);
        // Don't fail the request if push fails
      }
    }

    console.log(`Blog post created successfully: ${post.id} - ${post.slug}`);
    return NextResponse.json({
      success: true,
      post,
      message: 'Blog post created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to create blog post';
    if (error.code === 'P2002') {
      errorMessage = 'A blog post with this title already exists. Please use a different title.';
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update an existing blog post (coach only)
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized. Please log in again.' }, { status: 401 });
    }

    const userRole = authUser.role?.toLowerCase();
    if (userRole !== 'coach') {
      return NextResponse.json({
        error: 'Only coaches can edit blog posts.'
      }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, content, excerpt, coverImage, videoUrl, published } = body;

    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
    }

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Generate new slug if title changed
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate read time
    const wordCount = trimmedContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Determine publishedAt
    let publishedAt = existingPost.publishedAt;
    if (published && !existingPost.published) {
      publishedAt = new Date();
    } else if (!published) {
      publishedAt = null;
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: title.trim(),
        slug,
        content: trimmedContent,
        excerpt: excerpt?.trim() || null,
        coverImage: coverImage?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        published: published || false,
        publishedAt,
        readTime,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    console.log(`Blog post updated: ${updatedPost.id} - ${updatedPost.slug}`);
    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: 'Blog post updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating blog post:', error);

    let errorMessage = 'Failed to update blog post';
    if (error.code === 'P2002') {
      errorMessage = 'A blog post with this title already exists. Please use a different title.';
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a blog post (coach only)
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized. Please log in again.' }, { status: 401 });
    }

    const userRole = authUser.role?.toLowerCase();
    if (userRole !== 'coach') {
      return NextResponse.json({
        error: 'Only coaches can delete blog posts.'
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    const postId = parseInt(id);
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid blog post ID' }, { status: 400 });
    }

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({ where: { id: postId } });
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id: postId } });

    console.log(`Blog post deleted: ${postId}`);
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
