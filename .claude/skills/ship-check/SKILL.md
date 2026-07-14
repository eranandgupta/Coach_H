---
name: ship-check
description: Pre-deploy / pre-commit verification gate for this Next.js + Prisma app. Use before committing, pushing, or deploying, or when the user says "is this ready to ship", "check the build", "verify before deploy", or asks to confirm a change is safe. Runs the project's real quality gates in order and reports pass/fail.
---

# Ship check (Coach Himanshu)

Run the project's actual gates **in this order** and stop at the first hard failure, reporting the exact error. Do not claim "ready" unless every gate passes.

## Gates (from package.json scripts)
1. **Types** — `npm run typecheck` (`tsc --noEmit`). Fix type errors before anything else.
2. **Lint** — `npm run lint` (`next lint`). Fix or justify warnings; errors block.
3. **Prisma in sync** — if `prisma/schema.prisma` changed: `npx prisma generate`, and confirm migrations/`db push` were applied. `npm run build` also runs `prisma generate` first.
4. **Build** — `npm run build` (runs `prisma generate && next build`). This is the real gate — it catches server/client boundary errors, bad metadata, and route issues that dev hides.

## Then, for the change at hand
- **Runtime smoke test**: start `npm run dev` and actually exercise the changed flow in the browser (or via the chrome-devtools MCP tools if available) — don't rely on a green build alone.
- **SEO-affecting change?** confirm `/sitemap.xml`, canonical, and JSON-LD still render (see the `seo-page` skill).
- **DB/env-dependent?** confirm required vars exist in `.env` (compare against `.env.example`); never commit `.env`.
- **Secrets**: ensure no keys, tokens, or `.env` values are in the diff before commit.

## Reporting
Give a short verdict: ✅ each gate that passed, ❌ the first that failed with the error and the fix. If the user asked to commit/push, only proceed after all gates are green (and only commit/push when they explicitly asked).

## Notes
- This is a Next.js 13 App Router app; `next build` failures are usually "use client"/server component boundary issues or metadata typing — read the error, don't guess.
- Package manager is npm (there's a `package-lock.json`).
