import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getAllCitySlugs } from '@/lib/cities';
import { getAllCountrySlugs } from '@/lib/countries';

const baseUrl = 'https://coachhimanshu.com';

// ─────────────────────────────────────────────────────────────────────────────
// Sitemap Index Architecture (like Apple, Google, Amazon)
//
// Generates a sitemap index with multiple sub-sitemaps organized by content:
//   /sitemap/0.xml  → Core pages (home, about, assessment, etc.)
//   /sitemap/1.xml  → Blog content (listing + all 64+ articles)
//   /sitemap/2.xml  → Location pages (15 city-specific SEO pages)
//   /sitemap/3.xml  → Legal & policy pages
//   /sitemap/4.xml  → Resources & feeds (knowledge, FAQ, RSS, llms.txt)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateSitemaps() {
  return [
    { id: 0 }, // Core pages
    { id: 1 }, // Blog content
    { id: 2 }, // Location/city pages
    { id: 3 }, // Legal & policy pages
    { id: 4 }, // Resources, feeds & discovery
    { id: 5 }, // International / country pages
  ];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  switch (id) {
    case 0:
      return getCorePages();
    case 1:
      return await getBlogPages();
    case 2:
      return getLocationPages();
    case 3:
      return getLegalPages();
    case 4:
      return getResourcePages();
    case 5:
      return getInternationalPages();
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sitemap 0: Core Pages — highest priority, the main conversion funnel
// ─────────────────────────────────────────────────────────────────────────────
function getCorePages(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/assessment`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fit-bharat-mission`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Sitemap 1: Blog Content — dynamic, fetched from database
// Includes the blog listing page + all individual blog posts
// ─────────────────────────────────────────────────────────────────────────────
async function getBlogPages(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let blogPosts: { slug: string; updatedAt: Date; publishedAt: Date | null }[] = [];
  try {
    blogPosts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    });
  } catch {
    // If DB is unavailable, return just the listing page
  }

  const blogListingPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...blogListingPage, ...blogPostPages];
}

// ─────────────────────────────────────────────────────────────────────────────
// Sitemap 2: Location Pages — programmatic city-specific SEO pages
// Targets "fitness coach in {city}" queries across India
// ─────────────────────────────────────────────────────────────────────────────
function getLocationPages(): MetadataRoute.Sitemap {
  const now = new Date();
  const citySlugs = getAllCitySlugs();

  const hubPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/fitness-coach`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  const cityPages: MetadataRoute.Sitemap = citySlugs.map((slug) => ({
    url: `${baseUrl}/fitness-coach/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...hubPage, ...cityPages];
}

// ─────────────────────────────────────────────────────────────────────────────
// Sitemap 3: Legal & Policy Pages — low priority, rarely change
// ─────────────────────────────────────────────────────────────────────────────
function getLegalPages(): MetadataRoute.Sitemap {
  const now = new Date();
  const legalPages = [
    'privacy-policy',
    'terms-of-service',
    'refund-policy',
    'cancellation-policy',
    'disclaimer',
  ];

  return legalPages.map((page) => ({
    url: `${baseUrl}/${page}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Sitemap 4: Resources, Feeds & Discovery — knowledge hub, FAQ, feeds
// Includes machine-readable discovery files for AI crawlers
// ─────────────────────────────────────────────────────────────────────────────
function getResourcePages(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${baseUrl}/knowledge`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/feed.xml`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.5,
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Sitemap 5: International Pages — programmatic country landing pages
// Targets "online Indian fitness coach in {country}" / NRI queries worldwide
// ─────────────────────────────────────────────────────────────────────────────
function getInternationalPages(): MetadataRoute.Sitemap {
  const now = new Date();
  const countrySlugs = getAllCountrySlugs();

  const hubPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/online-fitness-coach`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  const countryPages: MetadataRoute.Sitemap = countrySlugs.map((slug) => ({
    url: `${baseUrl}/online-fitness-coach/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...hubPage, ...countryPages];
}
