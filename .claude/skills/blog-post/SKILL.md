---
name: blog-post
description: Write and publish a new SEO-optimized blog article for the Coach Himanshu site. Use whenever the user wants a new blog post, article, or content piece for the blog. Follows the project's DB-backed BlogPost model and seed-script workflow so the post is automatically indexed, structured-data-tagged, and added to the sitemap.
---

# Author a blog post (Coach Himanshu)

Blog posts are rows in the database (`BlogPost` Prisma model), **not** MDX files. Once published, they are automatically: rendered at `/blog/<slug>`, wrapped with `BlogPosting`/`FAQPage`/`BreadcrumbList` JSON-LD by `app/blog/[slug]/layout.tsx`, and included in sitemap bucket 1 via `app/sitemap.ts`. So your job is the content + a seed entry.

## BlogPost model (prisma/schema.prisma)
```
id, title, slug (unique), content (LongText HTML/markdown), excerpt (Text),
coverImage (url), authorId (FK User), published (bool), publishedAt (DateTime?),
readTime (Int, minutes), views, videoUrl?
```

## Workflow
1. **Confirm the topic + primary keyword** with the user if not given (this site targets India fitness/nutrition queries — e.g. "high protein Indian vegetarian diet", "home workout no equipment India").
2. **Write the article** — structure for SEO and readability:
   - One `<h1>` = the title; keyword-front-loaded, < 60 chars.
   - Intro that states the payoff in the first 2 sentences (speakable/AI-snippet friendly).
   - `<h2>`/`<h3>` sections; short paragraphs; bullet lists; a comparison table where useful.
   - Indian context: local foods, ₹ pricing, WhatsApp support, realistic for Indian readers.
   - End with a **FAQ section** (3–6 Q&As) — the `[slug]/layout.tsx` turns these into `FAQPage` schema, so use clear `Question`/`Answer` phrasing.
   - Soft CTA to the assessment/plans, plus 2–3 internal links to related posts or `/knowledge`.
   - `excerpt`: 150–160 char summary (also used as meta description).
   - `readTime`: estimate at ~200 words/min.
3. **Slug**: lowercase, hyphenated, keyword-first, no stop-word noise (e.g. `high-protein-indian-vegetarian-diet`). Must be unique.
4. **Add a seed entry** following the existing pattern in `scripts/seed-seo-blogs.ts` / `seed-seo-blogs-2.ts` / `seed-seo-blogs-3.ts` (create the next-numbered file for a new batch). Set `published: true` and a real `publishedAt` only when it should go live; otherwise leave as draft.
5. **Seed it**: `npx tsx scripts/seed-seo-blogs-<n>.ts` (or `npm run seed`). Requires DB env in `.env`.
6. **Verify**: visit `/blog/<slug>` (via `npm run dev`), confirm it renders, then `npm run typecheck`. The sitemap and JSON-LD update automatically.

## Quality bar
- Original, genuinely useful, specific to Indian fitness — not generic filler.
- Factually careful on nutrition/training claims; no medical guarantees (site has a disclaimer page for a reason).
- Never fabricate a coverImage URL — omit it or use an existing ImageKit asset.
- Don't set `authorId` to a value that doesn't exist; reuse the coach's user id used by existing seeds.
