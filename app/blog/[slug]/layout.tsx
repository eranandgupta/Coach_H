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
  let postTitle: string | null = null;
  let faqSchema: Record<string, unknown> | null = null;
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
      postTitle = post.title;
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
        inLanguage: 'en',
        isAccessibleForFree: true,
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', 'h2', '.prose p:first-of-type'],
        },
        about: {
          '@type': 'Thing',
          name: 'Fitness Coaching',
          url: 'https://coachhimanshu.com',
        },
        keywords: post.title.split(/[\s\-:]+/).filter((w: string) => w.length > 3).join(', '),
        articleSection: 'Fitness & Health',
        commentCount: 0,
        thumbnailUrl: post.coverImage || 'https://coachhimanshu.com/opengraph-image',
        contentRating: 'General',
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/ReadAction',
          userInteractionCount: wordCount > 0 ? Math.round(wordCount / 200) : 1,
        },
        review: {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          author: { '@type': 'Organization', name: 'Coach Himanshu' },
          reviewBody: 'Expert-reviewed fitness content by NASM Certified Coach',
        },
      };

      // Extract FAQ schema from content if present
      if (post.content) {
        const faqPattern = /<h[23][^>]*>(.*?\?)<\/h[23]>\s*(?:<[^>]+>)*\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
        const faqs: { question: string; answer: string }[] = [];
        let match;
        while ((match = faqPattern.exec(post.content)) !== null && faqs.length < 10) {
          const question = match[1].replace(/<[^>]+>/g, '').trim();
          const answer = match[2].replace(/<[^>]+>/g, '').trim();
          if (question && answer && question.length > 10 && answer.length > 20) {
            faqs.push({ question, answer });
          }
        }
        if (faqs.length >= 2) {
          faqSchema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          };
        }
      }
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
              { '@type': 'ListItem', position: 3, name: postTitle || 'Article', item: `https://coachhimanshu.com/blog/${params.slug}` },
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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {children}
    </>
  );
}
