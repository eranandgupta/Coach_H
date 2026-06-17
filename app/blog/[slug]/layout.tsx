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

export default async function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  let blogPostSchema = null;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true },
      select: {
        title: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        updatedAt: true,
        content: true,
        author: { select: { name: true } },
      },
    });

    if (post) {
      const wordCount = post.content ? post.content.split(/\s+/).length : 0;
      blogPostSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || post.title,
        image: post.coverImage || 'https://coachhimanshu.com/opengraph-image',
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt?.toISOString(),
        wordCount,
        author: {
          '@type': 'Person',
          name: post.author?.name || 'Coach Himanshu',
          url: 'https://coachhimanshu.com/about',
          jobTitle: 'NASM Certified Fitness Coach',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Coach Himanshu',
          url: 'https://coachhimanshu.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://coachhimanshu.com/favicon.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://coachhimanshu.com/blog/${params.slug}`,
        },
        isPartOf: {
          '@type': 'Blog',
          name: 'Coach Himanshu Fitness Blog',
          url: 'https://coachhimanshu.com/blog',
        },
      };
    }
  } catch {
    // If DB unavailable, skip schema
  }

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
      {blogPostSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
        />
      )}
      {children}
    </>
  );
}
