import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Blog view counter.
 *
 * The public post page (app/blog/[slug]/page.tsx) is ISR-cached (revalidate = 3600)
 * and reads the post directly from Prisma, so it can't count real visits. Instead a
 * tiny client beacon (components/BlogViewTracker.tsx) POSTs here once per browser
 * session per post, which runs on every genuine page load regardless of caching.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // Only count published posts; updateMany avoids throwing when the slug isn't found.
    const result = await prisma.blogPost.updateMany({
      where: { slug, published: true },
      data: { views: { increment: 1 } },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error incrementing blog view:', error);
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
  }
}
