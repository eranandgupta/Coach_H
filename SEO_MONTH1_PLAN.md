# SEO First Month Action Plan - Coach Himanshu

## Current Status (Audit Summary)

| Item | Status |
|------|--------|
| Meta tags, title, description, keywords | Done |
| Open Graph & Twitter cards | Done |
| Structured data (JSON-LD) | Done |
| Sitemap | Done |
| Robots.txt | Done |
| Manifest.json (PWA) | Done |
| Blog pages | Done |
| Google Verification Code | NOT DONE (placeholder) |
| OG Image (og-image.jpg) | MISSING |
| Google Analytics 4 | NOT DONE |
| Google Search Console | NOT DONE |
| Image optimization (WebP) | NOT DONE |

---

## Week 1: Setup & Foundation (Day 1-7)

### Day 1-2: Google Search Console Setup
- [ ] Go to https://search.google.com/search-console
- [ ] Add property: `coachhimanshu.com`
- [ ] Get the verification meta tag code
- [ ] Replace `'your-google-verification-code'` in `app/layout.tsx` (line 93)
- [ ] Verify the site
- [ ] Submit sitemap: `https://coachhimanshu.com/sitemap.xml`
- [ ] Request indexing for all main pages

**Screenshot to save for report:**
- Search Console verification success
- Sitemap submitted confirmation

### Day 2-3: Google Analytics 4 Setup
- [ ] Go to https://analytics.google.com
- [ ] Create a new GA4 property for `coachhimanshu.com`
- [ ] Get the Measurement ID (G-XXXXXXXXXX)
- [ ] Add GA4 script to `app/layout.tsx`
- [ ] Verify real-time data is coming in

**Screenshot to save for report:**
- GA4 dashboard showing live data

### Day 3-4: OG Image Creation
- [ ] Create a professional image (1200x630px) with:
  - Coach Himanshu logo/photo
  - Tagline: "NASM Certified Online Fitness Coach"
  - Website URL
  - Clean, professional design
- [ ] Save as `/public/og-image.jpg`
- [ ] Test sharing on WhatsApp, Facebook, Twitter
- [ ] Verify with https://cards-dev.twitter.com/validator

**Screenshot to save for report:**
- Social media preview showing rich card

### Day 4-5: Run Baseline Audit (IMPORTANT FOR REPORT)
- [ ] Run Google PageSpeed Insights — save screenshot of scores
- [ ] Run Lighthouse audit — save full report PDF
- [ ] Run Rich Results Test — save screenshot
- [ ] Run Mobile-Friendly Test — save screenshot
- [ ] Check current Google ranking for target keywords using Ubersuggest
- [ ] Save all screenshots in a "baseline" folder

**This is your "BEFORE" data — you will compare against this every month**

### Day 5-7: Fix Critical Issues
- [ ] Update phone number in structured data (`app/page.tsx`)
- [ ] Verify all OG tags are working
- [ ] Check for any 404 errors in Search Console
- [ ] Fix any crawl errors reported

---

## Week 2: Content & Optimization (Day 8-14)

### Day 8-9: Image Optimization
- [ ] Convert all PNG/JPEG images in `/public/` to WebP format
- [ ] Use tool: https://squoosh.app (free)
- [ ] Keep originals as fallback
- [ ] Update image references in code
- [ ] Target: reduce total image size by 40-60%

**Screenshot to save for report:**
- Before/after file sizes comparison

### Day 10-11: Blog Content (Post 1 & 2)
- [ ] Write Blog Post 1: "Top 10 Home Workout Exercises for Beginners in India"
  - Target keyword: "home workout India"
  - Length: 1500+ words
  - Include images with alt text
- [ ] Write Blog Post 2: "Why You Need a NASM Certified Fitness Coach"
  - Target keyword: "NASM certified coach India"
  - Length: 1200+ words

### Day 12-14: On-Page Optimization
- [ ] Add FAQ section to homepage with FAQ schema markup
- [ ] Add breadcrumb navigation
- [ ] Add internal links between blog posts and main pages
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
  - Website URL
  - Phone number
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

## First Month Client Report Template

```
============================================
  MONTHLY SEO REPORT - COACH HIMANSHU
  Month 1: [Start Date] - [End Date]
============================================

1. WORK COMPLETED
-----------------
  [x] Google Search Console - Set up & verified
  [x] Google Analytics 4 - Installed & tracking
  [x] OG Image - Created for social sharing
  [x] Google Business Profile - Created
  [x] Image Optimization - Converted to WebP
  [x] Blog Posts Published - 4 articles
  [x] FAQ Section - Added with schema markup
  [x] Directory Submissions - 5+ directories
  [x] Backlink - 1 guest post published

2. TECHNICAL SCORES
-------------------
  Metric              Before    After     Change
  ------------------------------------------------
  PageSpeed (Mobile)   __/100   __/100    +__
  PageSpeed (Desktop)  __/100   __/100    +__
  SEO Score            __/100   __/100    +__
  Accessibility        __/100   __/100    +__
  Performance          __/100   __/100    +__

3. SEARCH CONSOLE DATA
----------------------
  Pages Indexed:    __
  Total Impressions: __
  Total Clicks:      __
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
