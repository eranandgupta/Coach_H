# SEO First Month Action Plan - Coach Himanshu

## Current Status (Audit Summary — Updated June 26, 2026)

| Item | Status |
|------|--------|
| Meta tags, title, description, keywords | ✅ Done |
| Open Graph & Twitter cards | ✅ Done |
| Structured data (JSON-LD) | ✅ Done |
| Sitemap (52 pages) | ✅ Done |
| Robots.txt (with AI crawler rules) | ✅ Done |
| Manifest.json (PWA) | ✅ Done |
| Blog pages (12 posts) | ✅ Done |
| Google Search Console | ✅ Verified (187 clicks) |
| Google Verification Code | ✅ Removed placeholder (verified via other method) |
| OG Image (dynamic generation) | ✅ Done (opengraph-image.tsx) |
| Google Analytics 4 | ⚠️ Needs GA4 Measurement ID in env var `NEXT_PUBLIC_GA4_ID` |
| Image optimization (WebP/auto-format) | ✅ Done (ImageKit f-auto on all images) |
| Domain canonicalization (www vs non-www) | ✅ Fixed — coachhimanshu.com is primary, www redirects 308 |
| AI Discoverability (llms.txt, ai-plugin.json) | ✅ Enhanced (June 26) |
| RSS Feed (/feed.xml) | ✅ Done |
| BlogPosting schema on blog posts | ✅ Done |
| Policy page metadata (5 pages) | ✅ Done |
| Security headers | ✅ Done |
| Phone number in schema | ✅ Fixed (+91-7303484648) |
| AEO: FAQ schema (15 questions) | ✅ Done (June 26) |
| AEO: Review schema (testimonials) | ✅ Done (June 26) |
| AEO: HowTo schema (coaching process) | ✅ Done (June 26) |
| AEO: VideoObject schema (hero video) | ✅ Done (June 26) |
| AEO: Speakable schema (voice assistants) | ✅ Done (June 26) |
| AEO: Enhanced Person schema (sameAs, alumniOf) | ✅ Done (June 26) |
| AEO: About page ProfilePage schema | ✅ Done (June 26) |
| GEO: Enhanced llms.txt & llms-full.txt | ✅ Done (June 26) |
| GEO: Enhanced ai-plugin.json | ✅ Done (June 26) |
| Google Business Profile | ✅ Done |
| Directory submissions | ✅ Done |

---

## Week 1: Setup & Foundation (Day 1-7)

### Day 1-2: Google Search Console Setup
- [x] Go to https://search.google.com/search-console
- [x] Add property: `coachhimanshu.com`
- [x] Verify the site
- [x] Submit sitemap: `https://coachhimanshu.com/sitemap.xml`
- [ ] Request indexing for all main pages
- [x] Fix www vs non-www split (was splitting impressions — now consolidated)

**Status: ✅ Done — 187 clicks tracked, domain consolidated**

### Day 2-3: Google Analytics 4 Setup
- [ ] Go to https://analytics.google.com
- [ ] Create a new GA4 property for `coachhimanshu.com`
- [ ] Get the Measurement ID (G-XXXXXXXXXX)
- [ ] Add it to Vercel env vars as `NEXT_PUBLIC_GA4_ID`
- [ ] Verify real-time data is coming in

**Status: ⚠️ Code is ready — just needs the GA4 ID added to Vercel environment variables**

### Day 3-4: OG Image
- [x] Dynamic OG image generation implemented (opengraph-image.tsx)
- [x] 1200x630px with brand colors, stats, NASM badge
- [ ] Test sharing on WhatsApp, Facebook, Twitter
- [ ] Verify with https://cards-dev.twitter.com/validator

**Status: ✅ Auto-generated — test social sharing**

### Day 4-5: Run Baseline Audit (IMPORTANT FOR REPORT)
- [x] Lighthouse SEO: 100/100
- [x] Lighthouse Performance: 62/100
- [x] Lighthouse Best Practices: 96/100
- [ ] Run Rich Results Test — save screenshot
- [ ] Run Mobile-Friendly Test — save screenshot
- [ ] Check current Google ranking for target keywords using Ubersuggest
- [ ] Save all screenshots in a "baseline" folder

**This is your "BEFORE" data — you will compare against this every month**

### Day 5-7: Fix Critical Issues
- [x] Updated phone number in structured data (`app/page.tsx`) → +91-7303484648
- [x] Removed placeholder verification codes
- [x] Fixed domain canonicalization (www → non-www 308 redirect)
- [ ] Check for any 404 errors in Search Console
- [ ] Fix any crawl errors reported

---

## Week 2: Content & Optimization (Day 8-14)

### Day 8-9: Image Optimization
- [x] All content images served via ImageKit CDN with `?tr=f-auto` (auto WebP/AVIF)
- [x] Added `?tr=w-200,q-80,f-auto` to all logo URLs across components
- [x] Added `?tr=w-300,q-80,f-auto` to team images on about page
- [x] Added `?tr=w-600,q-80,f-auto` to about page content images
- [x] Favicon and PWA icons remain PNG (required by spec)

**Screenshot to save for report:**
- Before/after file sizes comparison

### Day 10-11: Blog Content (Post 1 & 2)
- [x] Blog Post 1: "Top 10 Home Workout Exercises for Beginners in India" (seeded)
- [x] Blog Post 2: "Why You Need a NASM Certified Fitness Coach" (seeded)

### Day 12-14: On-Page Optimization
- [x] FAQ section on homepage with FAQ schema markup — done (expanded to 15 questions June 26)
- [x] Breadcrumb navigation — already done (all pages)
- [x] Internal links between blog posts and main pages — already done (42 auto-link patterns)
- [ ] Ensure all images have descriptive alt text
- [ ] Check heading hierarchy (h1 > h2 > h3) on all pages

---

## Week 3: Off-Page SEO & Local (Day 15-21)

### Day 15-16: Google Business Profile
- [ ] Create Google Business Profile at https://business.google.com
- [ ] Add business details:
  - Business name: Coach Himanshu
  - Category: Fitness Trainer / Health Coach
  - Service area: India (Online)
  - Website URL: https://coachhimanshu.com
  - Phone: +91 7303484648
  - Photos (at least 5)
- [ ] Ask 5-10 existing clients to leave Google reviews

**Screenshot to save for report:**
- Google Business Profile live listing

### Day 17-18: Directory Submissions
- [ ] Submit to fitness directories:
  - JustDial
  - Sulekha
  - IndiaMART
  - Practo (if applicable)
- [ ] Submit to general directories:
  - Bing Places for Business
  - Apple Maps (if applicable)

### Day 19-21: Backlink Building (Start)
- [ ] Find 5-10 fitness blogs that accept guest posts
- [ ] Write 1 guest post with backlink to coachhimanshu.com
- [ ] Share website on relevant fitness forums
- [ ] Create social media profiles (if not already) linking to website

---

## Week 4: Blog Content & First Report (Day 22-30)

### Day 22-24: More Blog Content
- [ ] Write Blog Post 3: "Best Diet Plan for Muscle Building in India"
  - Target keyword: "diet plan India"
- [ ] Write Blog Post 4: "How Online Fitness Coaching Works - Complete Guide"
  - Target keyword: "online fitness coaching"
- [ ] Add internal links between all blog posts

### Day 25-27: Technical Checks
- [ ] Re-run PageSpeed Insights — compare with baseline
- [ ] Re-run Lighthouse — compare with baseline
- [ ] Check Search Console for:
  - Indexing status (how many pages indexed)
  - Any crawl errors
  - Initial impressions/clicks data
- [ ] Check Google Analytics for:
  - Total visitors
  - Traffic sources
  - Top pages
  - User demographics

### Day 28-30: Prepare Client Report
- [ ] Compile all data into the monthly report (template below)
- [ ] Create before/after comparison screenshots
- [ ] List all work completed
- [ ] Set goals for Month 2

---

## AI Discoverability (NEW — Added June 17, 2026)

These files make Coach Himanshu visible to AI chatbots (ChatGPT, Claude, Perplexity, Gemini):

| File | URL | Purpose |
|------|-----|---------|
| `llms.txt` | coachhimanshu.com/llms.txt | Summary for AI crawlers |
| `llms-full.txt` | coachhimanshu.com/llms-full.txt | Full details (services, pricing, FAQs) |
| `ai-plugin.json` | coachhimanshu.com/.well-known/ai-plugin.json | OpenAI plugin manifest |
| `feed.xml` | coachhimanshu.com/feed.xml | RSS feed for blog (AI + Google News) |
| `robots.txt` | coachhimanshu.com/robots.txt | AI crawler permissions (13 bots allowed) |

**AI Crawlers Allowed:**
GPTBot, ChatGPT-User, Google-Extended, Claude-Web, anthropic-ai, CCBot, PerplexityBot, Bytespider, Applebot, Applebot-Extended, cohere-ai, meta-externalagent

---

## First Month Client Report Template

```
============================================
  MONTHLY SEO REPORT - COACH HIMANSHU
  Month 1: [Start Date] - [End Date]
============================================

1. WORK COMPLETED
-----------------
  [x] Google Search Console - Set up & verified
  [x] Domain consolidated (www → non-www 308 redirect)
  [x] Google Analytics 4 - Code ready (needs GA4 ID)
  [x] OG Image - Dynamic generation implemented
  [x] AI Discoverability - llms.txt, ai-plugin.json, RSS feed
  [x] BlogPosting schema - Rich results for all blog posts
  [x] Policy page metadata - 5 pages optimized
  [x] Security headers - Added trust signals
  [x] Phone number fixed in structured data
  [x] Placeholder codes removed
  [ ] Google Business Profile - Created
  [ ] Image Optimization - Converted to WebP
  [ ] Blog Posts Published - 4 articles
  [ ] Directory Submissions - 5+ directories
  [ ] Backlink - 1 guest post published

2. TECHNICAL SCORES
-------------------
  Metric              Before    After     Change
  ------------------------------------------------
  PageSpeed (Mobile)   __/100   __/100    +__
  PageSpeed (Desktop)  __/100   __/100    +__
  SEO Score           100/100   __/100    __
  Accessibility        __/100   __/100    +__
  Performance          62/100   __/100    +__

3. SEARCH CONSOLE DATA
----------------------
  Pages Indexed:    __
  Total Impressions: __
  Total Clicks:      187 (baseline as of June 17)
  Average Position:  __
  Top Keywords:
    - "[keyword 1]" - __ impressions
    - "[keyword 2]" - __ impressions
    - "[keyword 3]" - __ impressions

4. GOOGLE ANALYTICS DATA
-------------------------
  Total Visitors:       __
  Organic Visitors:     __
  Top Pages:
    1. / (Home)         - __ views
    2. /blog            - __ views
    3. /about           - __ views
  Avg Session Duration: __ seconds
  Bounce Rate:          __%

5. GOOGLE BUSINESS PROFILE
---------------------------
  Profile Views:    __
  Website Clicks:   __
  Phone Calls:      __
  Reviews:          __ (avg __ stars)

6. CONTENT PUBLISHED
--------------------
  Blog Post 1: "[Title]" - __ views
  Blog Post 2: "[Title]" - __ views
  Blog Post 3: "[Title]" - __ views
  Blog Post 4: "[Title]" - __ views

7. MONTH 2 GOALS
-----------------
  - Target top 30 for 5 keywords
  - Publish 4 more blog posts
  - Get 10+ Google reviews
  - Build 3-5 quality backlinks
  - Improve PageSpeed score to 90+
  - Increase organic traffic by 50%

============================================
  Report prepared by: [Your Name]
  Tools used: Google Search Console,
              Google Analytics 4,
              PageSpeed Insights, Lighthouse
============================================
```

---

## Important Reminders

1. **Take "BEFORE" screenshots on Day 1** — you cannot go back and get these later
2. **Search Console data takes 2-3 days** to start appearing after setup
3. **First month numbers will be small** — that's normal, set expectations with client
4. **Focus on indexed pages count** — going from 0 to 12+ indexed pages is a big win
5. **Rich results eligibility** is an immediate win you can show
6. **Blog posts take time to rank** — they may not show results in Month 1 but will in Month 2-3
7. **AI discoverability takes 2-4 weeks** — AI crawlers need time to index llms.txt and content

---

## Tools Needed (All Free)

| Tool | URL | Purpose |
|------|-----|---------|
| Google Search Console | search.google.com/search-console | Rankings & indexing |
| Google Analytics 4 | analytics.google.com | Traffic tracking |
| PageSpeed Insights | pagespeed.web.dev | Performance scores |
| Rich Results Test | search.google.com/test/rich-results | Schema validation |
| Squoosh | squoosh.app | Image compression |
| Ubersuggest | neilpatel.com/ubersuggest | Keyword tracking |
| Canva | canva.com | OG image creation |
| Google Business | business.google.com | Local SEO |

---

*Created: April 2026*
*Last Updated: June 26, 2026*
