import { generateSitemaps } from '@/app/sitemap';

// Sitemap index. app/sitemap.ts splits the site into /sitemap/{id}.xml files, and Next 13 does
// not generate an index for them, so /sitemap.xml (the URL robots.txt points to) was a 404.
// next.config.js rewrites /sitemap.xml here; the list comes from generateSitemaps(), so a new
// sub-sitemap is picked up automatically.
export const dynamic = 'force-dynamic';

const BASE = 'https://coachhimanshu.com';

export async function GET() {
  const ids = await generateSitemaps();
  const now = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ids.map(({ id }) => `  <sitemap><loc>${BASE}/sitemap/${id}.xml</loc><lastmod>${now}</lastmod></sitemap>`).join('\n')}
</sitemapindex>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
  });
}
