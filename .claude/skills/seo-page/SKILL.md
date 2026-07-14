---
name: seo-page
description: Add or audit SEO for any route in this Next.js app. Use whenever creating a new page/route, or when the user mentions SEO, metadata, meta tags, title/description, canonical, OpenGraph, Twitter cards, structured data / JSON-LD / schema.org, sitemap, robots, or ranking. Encodes this project's exact SEO conventions so every page stays consistent.
---

# SEO for a route (Coach Himanshu, Next.js 13 App Router)

This site already has a mature SEO system. **Match the existing conventions — do not invent new ones.** Domain is always `https://coachhimanshu.com`. Locale is `en_IN`, currency `₹`.

## The pattern: metadata lives in `layout.tsx`, not the page

Every public route has a sibling `layout.tsx` that owns metadata + JSON-LD. The `page.tsx` stays a client/UI component. Reference implementations:
- `app/blog/[slug]/layout.tsx` — richest example (BlogPosting, FAQPage, BreadcrumbList JSON-LD)
- `app/fitness-coach/[city]/layout.tsx` — dynamic `generateMetadata` + `ProfessionalService` schema
- `app/faq/layout.tsx`, `app/contact/layout.tsx` — simple static pages
- Root defaults live in `app/layout.tsx` (title template `%s | Coach Himanshu`, keywords, OG, Twitter `@coach_himanshu_`, robots).

## Checklist when adding SEO to a route

1. **Create `app/<route>/layout.tsx`** exporting `metadata` (static) or `async generateMetadata()` (dynamic). Include:
   - `title` (concise, keyword-front-loaded; root template appends `| Coach Himanshu`)
   - `description` (~150–160 chars, benefit + proof like "1000+ transformations" + price "₹799/month" where natural)
   - `openGraph` { title, description, url, type } and `twitter` { card: 'summary_large_image', title, description }
   - `alternates: { canonical: 'https://coachhimanshu.com/<route>' }` — **always set canonical**
2. **Add JSON-LD** via a `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />` in the layout's returned JSX. Pick the right `@type`:
   - Article/blog → `BlogPosting` (+ `FAQPage` if the page has Q&A, + `BreadcrumbList`)
   - Location page → `ProfessionalService` / `LocalBusiness`
   - Service/plan → `Service` or `Product` with `offers`
   - Org-level → `Organization` (already in root)
   - Always add `BreadcrumbList` for nested pages.
3. **Register in the sitemap** — `app/sitemap.ts` uses a sitemap *index* split by content type (0 core, 1 blog, 2 city, 3 legal, 4 resources). Add the URL to the correct bucket with a sensible `priority` (core 0.7–1.0, blog 0.7, city 0.8, legal 0.3) and `changeFrequency`. DB-backed content (blog) is fetched via Prisma — no manual entry needed.
4. **Internal links** — link the new page from at least one existing high-priority page and, where relevant, from `/knowledge` or `/blog`. Orphan pages don't rank.
5. **Verify**: run `npm run typecheck`, then check the rendered `<head>` and validate JSON-LD (paste into search.google.com/test/rich-results mentally — ensure required fields present, no trailing undefined).

## Auditing an existing page
Confirm, in order: unique title < 60 chars → description 150–160 chars → canonical present → OG + Twitter present → exactly one `<h1>` → JSON-LD valid & type-appropriate → in sitemap → has internal inbound links → images have `alt`. Report gaps concisely, then fix.

## Guardrails
- Never duplicate a canonical or emit two conflicting titles (root template + explicit title is fine).
- Keep keyword usage natural — this site targets India fitness queries; don't keyword-stuff.
- Don't hardcode dates in JSON-LD; use the record's `publishedAt`/`updatedAt`.
