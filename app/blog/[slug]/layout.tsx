import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const description =
    post.excerpt ||
    `Read "${post.title}" by ${post.author?.name || 'Coach Himanshu'} on the Coach Himanshu fitness blog.`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `https://coachhimanshu.com/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author?.name || 'Coach Himanshu'],
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    alternates: {
      canonical: `https://coachhimanshu.com/blog/${params.slug}`,
    },
  };
}

export default function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://coachhimanshu.com/blog' },
              { '@type': 'ListItem', position: 3, name: 'Article', item: `https://coachhimanshu.com/blog/${params.slug}` },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
