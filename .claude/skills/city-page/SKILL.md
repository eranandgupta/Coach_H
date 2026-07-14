---
name: city-page
description: Add a new programmatic city/location SEO landing page under /fitness-coach/[city]. Use when the user wants to target a new city or "fitness coach in <city>" search queries. Adds one entry to lib/cities.ts and the page, metadata, LocalBusiness JSON-LD, sitemap entry, and static params are generated automatically.
---

# Add a city landing page (Coach Himanshu programmatic SEO)

The site targets "online fitness coach in <city>" queries with a single dynamic route `/fitness-coach/[city]` driven by a data array. **Adding a city = adding one object to `lib/cities.ts`.** Everything else is automatic:
- `app/fitness-coach/[city]/layout.tsx` → `generateStaticParams` (from `getAllCitySlugs`), `generateMetadata`, and `ProfessionalService` JSON-LD referencing the city's local foods/state.
- `app/sitemap.ts` bucket 2 → adds `/fitness-coach/<slug>` at priority 0.8.

## CityData shape (lib/cities.ts)
```ts
{
  slug: string;          // lowercase-hyphenated, matches URL — e.g. 'pune'
  name: string;          // 'Pune'
  state: string;         // 'Maharashtra'
  population: string;    // '7.4 million'
  description: string;   // reads after "the ..." — e.g. 'the cultural capital of Maharashtra'
  localFoods: string[];  // 5 authentic local dishes (used in meal-plan copy & schema)
  landmarks: string[];   // 3 well-known landmarks
  fitnessStats: string;  // one credible-sounding local fitness/lifestyle stat
}
```

## Workflow
1. **Confirm the city** and check it isn't already in `CITIES` (search `lib/cities.ts` for the slug/name).
2. **Append a new object** to the `CITIES` array with accurate, locally authentic data:
   - `localFoods`: real regional dishes (these drive "custom <city>-friendly meal plans" copy — get them right).
   - `landmarks`: recognizable, correctly spelled.
   - `fitnessStats`: plausible and phrased like the existing entries; don't invent precise fake percentages presented as hard research — keep it directional ("a majority of…") if unsure.
   - `description`: must read grammatically after the word "the" (existing copy uses `the ${description}`).
3. **Verify**: `npm run typecheck`, then `npm run dev` and open `/fitness-coach/<slug>` — confirm metadata, canonical, and JSON-LD render with the city substituted correctly.

## Guardrails
- One source of truth: never hardcode a city in the route files — only edit `lib/cities.ts`.
- Keep tone/format consistent with existing entries so pages don't look templated/spammy to Google (vary the descriptions and stats).
- Don't add near-duplicate thin pages for tiny towns with no distinct data — programmatic SEO works when each page is genuinely differentiated.
