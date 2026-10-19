# Phase 1 overview

The scope, timeline, costs and open questions for Phase 1. Terms follow [CONTEXT.md](../CONTEXT.md).

## Goal

The owner can publish recipes; anyone can read them, scale servings, switch units, download PDFs and cook from their phone. No reader sign-up. Target launch: **2027-02-01**. Moved from 2026-11-21 on 2026-10-19, when the plan was about two weeks behind (the data-model decisions took longer than week 1).

## In scope

- Custom admin dashboard: story, hero image, gallery, ingredient lines, steps with optional photos, draft/publish
- Public home page (the feed, filterable by meal type and tag) and post pages
- Sign-in with email and password; a sign-up page that shows "Sign up coming soon" (public sign-up closed, [ADR-0010](../adr/0010-dev-database-and-sign-in.md))
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
| 1–3 | 2026-09-28 | ✅ Scope and data model (ADR-0001 to 0010), USDA spike. Carried over: wireframes, checkbox PDF spike |
| 4 | 2026-10-19 | Schema, migration and seed (users, units, grocery sections, starter ingredients); Neon dev branch; checkbox PDF spike |
| 5 | 2026-10-26 | Admin sign-in and roles, closed sign-up, image uploads to R2 with resizing, USDA import; wireframes |
| 6–7 | 2026-11-02 | Dashboard shell, story/hero/gallery editor, ingredient editor (highest risk, two weeks) |
| 8 | 2026-11-16 | Step editor, publish check |
| 9 | 2026-11-23 | Feed, post page, slugs and redirects, static generation and SEO |
| 10 | 2026-11-30 | Servings scaling, unit toggle, step tokens |
| 11 | 2026-12-07 | Grocery list and its PDF, checklist |
| 12 | 2026-12-14 | Instructions PDF, cook mode, PWA |
| — | 2026-12-21 | Holiday break and buffer (two weeks) |
| 13 | 2027-01-04 | Accessibility and performance, device testing |
| 14 | 2027-01-11 | First real recipes, analytics |
| 15 | 2027-01-18 | [Launch checklist](../../notes/launch-checklist.md) (SMTP, domain, environment variables), buffer |
| 16 | 2027-01-25 | Launch on 2027-02-01 |

Estimate: about 110 hours at an assumed 15 hours/week.

## Costs

Phase 1 is $0/month: Vercel Hobby with the free `.vercel.app` subdomain, Neon free tier, R2 free tier, Better Auth. A custom domain comes when beta testers join. See [ADR-0000](../adr/0000-initial-decisions.md#hosting-free-tiers-for-phase-1).

## Future features

- **Platform:** reader accounts; creator accounts and creator dashboard; follows with email or web push notifications; Stripe payments and entitlements.
- **Paid, first wave:** merged grocery lists, weekly meal planner, pantry tracking, premium printables.
- **Core, not paywalled:** nutrition breakdown per serving, after Phase 1: imported per canonical ingredient, computed per recipe (see open questions).
- **Paid candidate:** checklists synced across devices.
- **Admin:** audit log of changes to records, for history if demand appears ([ADR-0002](../adr/0002-published-edits-go-live-immediately.md#later-audit-log)).
- **Back burner:** affiliate or grocery delivery links; creator monetization.

## Open questions

- ~~**Editing published recipes.** Do edits go live immediately, or into a pending revision with history and an "Updated" notice?~~ Resolved 2026-09-29: edits go live immediately on save; no revisions, no "Updated" notice. The editor shows a live banner on published posts. See [ADR-0002](../adr/0002-published-edits-go-live-immediately.md) and [the grilling notes](../../notes/2026-09-29-open-questions-grilling.md).
- ~~**Post vs Recipe.** Are these the same thing, or can there be posts that aren't recipes?~~ Resolved 2026-09-29: separate. A post has zero or one recipe; in Phase 1 every post has one. See [ADR-0001](../adr/0001-post-and-recipe-are-separate.md) and [the grilling notes](../../notes/2026-09-29-open-questions-grilling.md).
- ~~**Nutrition timing.** Is it in Phase 1 or later, and is it entered manually or taken from a data source?~~ Resolved 2026-09-29: not in Phase 1. Later, imported from a public dataset (the source is USDA FoodData Central, already imported in Phase 1 for canonical ingredients: [ADR-0004](../adr/0004-usda-reference-foods-for-canonical-ingredients.md)), stored per canonical ingredient, and computed per serving. Manual entry is only a fallback for unmatched ingredients. See [the grilling notes](../../notes/2026-09-29-open-questions-grilling.md).
- ~~**ORM.** Which one: Drizzle, Prisma or Kysely?~~ Resolved 2026-09-27: Prisma (already used elsewhere; fits Postgres + JSONB + no-separate-backend per ADR-0000).
- ~~**Neon free plan.** Does the account allow a second free project alongside the existing one?~~ Resolved 2026-09-27: yes, up to 100 free projects per account, each with its own quota.
- **Checkbox PDFs.** Which phone viewers keep the ticks? This is the week 1 spike.
- ~~**Jira setup.** Which project, and how it connects to the ticketing skills.~~ Resolved 2026-09-27: Jira subscription lapsed; switched to GitHub Issues on this repo. See [docs/agents/issue-tracker.md](../agents/issue-tracker.md).
