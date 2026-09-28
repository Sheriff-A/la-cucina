# Phase 1 overview

The scope, timeline, costs and open questions for Phase 1. Terms follow [CONTEXT.md](../CONTEXT.md).

## Goal

The owner can publish recipes; anyone can read them, scale servings, switch units, download PDFs and cook from their phone. No reader sign-up. Target launch: **2026-11-21**, eight weeks from 2026-09-28.

## In scope

- Custom admin dashboard: story, hero image, gallery, ingredient lines, steps with optional photos, draft/publish
- Public home page and recipe pages
- Servings scaling and the metric/imperial toggle, including step tokens
- Grocery list grouped by grocery section, as a PDF (tickable checkboxes if the week 1 spike works) and as an on-device checklist
- Instructions PDF, with step photos as an option
- Cook mode
- PWA: installable, recipes cached offline after viewing

## Out of scope for Phase 1

Reader accounts, creator accounts, follows and notifications, payments, merged grocery lists, meal planner, pantry tracking, premium printables. See [Future features](#future-features).

## Timeline

| Week | Starts | Focus |
|---|---|---|
| 1 | 2026-09-28 | Lock scope and data model, wireframes, repo/CI/deploy skeleton, spikes (checkbox PDFs, unit rules) |
| 2 | 2026-10-05 | Schema and migrations, admin sign-in and roles, image uploads to R2, canonical ingredients |
| 3 | 2026-10-12 | Dashboard shell, story/hero/gallery editor, ingredient editor (highest-risk week) |
| 4 | 2026-10-19 | Step editor, home page, recipe page, static generation and SEO |
| 5 | 2026-10-26 | Servings scaling, unit toggle, step tokens, grocery list and its PDF |
| 6 | 2026-11-02 | Instructions PDF, checklist, cook mode, PWA |
| 7 | 2026-11-09 | Accessibility and performance, device testing, first real recipes, analytics |
| 8 | 2026-11-16 | Buffer, launch |

Estimate: about 110 hours at an assumed 15 hours/week.

## Costs

Phase 1 is $0/month: Vercel Hobby with the free `.vercel.app` subdomain, Neon free tier, R2 free tier, Better Auth. A custom domain comes when beta testers join. See [ADR-0000](../adr/0000-initial-decisions.md#hosting-free-tiers-for-phase-1).

## Future features

- **Platform:** reader accounts; creator accounts and creator dashboard; follows with email or web push notifications; Stripe payments and entitlements.
- **Paid, first wave:** merged grocery lists, weekly meal planner, pantry tracking, premium printables.
- **Core, not paywalled:** nutrition breakdown per serving (timing to be decided).
- **Paid candidate:** checklists synced across devices.
- **Back burner:** affiliate or grocery delivery links; creator monetization.

## Open questions

- **Editing published recipes.** Do edits go live immediately, or into a pending revision with history and an "Updated" notice?
- **Post vs Recipe.** Are these the same thing, or can there be posts that aren't recipes?
- **Nutrition timing.** Is it in Phase 1 or later, and is it entered manually or taken from a data source?
- ~~**ORM.** Which one: Drizzle, Prisma or Kysely?~~ Resolved 2026-09-27: Prisma (already used elsewhere; fits Postgres + JSONB + no-separate-backend per ADR-0000).
- ~~**Neon free plan.** Does the account allow a second free project alongside the existing one?~~ Resolved 2026-09-27: yes, up to 100 free projects per account, each with its own quota.
- **Checkbox PDFs.** Which phone viewers keep the ticks? This is the week 1 spike.
- **Jira setup.** Which project, and how it connects to the ticketing skills.
