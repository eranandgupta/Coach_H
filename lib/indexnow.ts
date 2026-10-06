// IndexNow — instant URL submission shared by Bing (which also feeds Microsoft
// Copilot, ChatGPT search and DuckDuckGo), Yandex, Naver, Seznam and Yep.
// One POST to the shared endpoint fans out to every participating engine.
//
// The key is public by design: the engines verify ownership by fetching
// https://coachhimanshu.com/{key}.txt, which lives in public/.

const HOST = 'coachhimanshu.com';
export const INDEXNOW_KEY = '12c6cce50e7201b55cdf965484ec48d2';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const MAX_PER_REQUEST = 10000;

export interface IndexNowResult {
  submitted: number;
  batches: { count: number; status: number }[];
}

/** Submit absolute coachhimanshu.com URLs (or paths) to IndexNow. Never throws. */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const list = Array.from(
    new Set(urls.map((u) => (u.startsWith('http') ? u : `https://${HOST}${u.startsWith('/') ? '' : '/'}${u}`)))
  ).filter((u) => u.startsWith(`https://${HOST}`));

  const result: IndexNowResult = { submitted: 0, batches: [] };
  if (list.length === 0 || process.env.NODE_ENV !== 'production') return result;

  for (let i = 0; i < list.length; i += MAX_PER_REQUEST) {
    const urlList = list.slice(i, i + MAX_PER_REQUEST);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList }),
      });
      // 200 = done, 202 = accepted (key validation pending). Anything else is logged, not thrown.
      result.batches.push({ count: urlList.length, status: res.status });
      if (res.ok) result.submitted += urlList.length;
      else console.error(`IndexNow responded ${res.status} for ${urlList.length} URLs`);
    } catch (err) {
      console.error('IndexNow submission failed:', err);
      result.batches.push({ count: urlList.length, status: 0 });
    }
  }
  return result;
}

/** Fire-and-forget ping for a freshly published or updated page. */
export function pingIndexNow(urls: string[]) {
  void submitToIndexNow(urls);
}
