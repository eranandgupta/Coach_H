import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = 'https://coachhimanshu.com';

  let posts: { title: string; slug: string; excerpt: string | null; publishedAt: Date | null; author: { name: string | null } | null }[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        author: { select: { name: true } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });
  } catch {
    // If DB unavailable, return empty feed
  }

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || post.title)}</description>
      <author>info@coachhimanshu.com (${escapeXml(post.author?.name || 'Coach Himanshu')})</author>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
    </item>`
    )
    .join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Coach Himanshu - Fitness Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Expert fitness articles, workout guides, nutrition tips, and health advice by NASM Certified Coach Himanshu.</description>
    <language>en-in</language>
    <managingEditor>info@coachhimanshu.com (Coach Himanshu)</managingEditor>
    <webMaster>info@coachhimanshu.com (Coach Himanshu)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/favicon.png</url>
      <title>Coach Himanshu</title>
      <link>${baseUrl}</link>
    </image>${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
