import { NextRequest, NextResponse } from 'next/server';
import sitemap, { generateSitemaps } from '@/app/sitemap';
import { submitToIndexNow } from '@/lib/indexnow';

// Submits every URL in the sitemap index to IndexNow (Bing, Copilot, ChatGPT
// search, DuckDuckGo, Yandex, Naver…). Run weekly by the Vercel cron in
// vercel.json, or by hand:  curl -H "Authorization: Bearer $CRON_SECRET" https://coachhimanshu.com/api/cron/indexnow
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'your-secret-key-here';
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized - Invalid cron secret' }, { status: 401 });
  }

  const ids = await generateSitemaps();
  const entries = await Promise.all(ids.map(({ id }) => sitemap({ id })));
  const urls = entries.flat().map((e) => e.url);

  const result = await submitToIndexNow(urls);
  return NextResponse.json({ success: true, totalUrls: urls.length, ...result });
}
