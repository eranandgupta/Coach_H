'use client';

import { useEffect, useRef } from 'react';

/**
 * Records one blog view per browser session per post.
 *
 * The post page is ISR-cached and server-rendered, so it can't count visits itself.
 * This client beacon fires on mount and increments the DB view counter via
 * /api/blog/[slug]/view. A sessionStorage guard (and a ref for React strict-mode's
 * double effect in dev) keeps a single visit from being counted more than once.
 */
export default function BlogViewTracker({ slug }: { slug: string }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!slug || firedRef.current) return;
    firedRef.current = true;

    const key = `blog_viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // sessionStorage unavailable (private mode / SSR) — still count the view.
    }

    fetch(`/api/blog/${encodeURIComponent(slug)}/view`, {
      method: 'POST',
      keepalive: true,
    }).catch(() => {
      /* best-effort; a missed view shouldn't affect the reader */
    });
  }, [slug]);

  return null;
}
