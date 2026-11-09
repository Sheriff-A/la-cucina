# Phase 1 overview

The scope, checklist, costs and open questions for Phase 1. Terms follow [CONTEXT.md](../CONTEXT.md).

## Goal

The owner can publish recipes; anyone can read them, scale servings, switch units, download PDFs and cook from their phone. No reader sign-up. Target launch: **2027-02-01**.

## In scope

- Custom admin dashboard: story, hero image, gallery, ingredient lines, steps with optional photos, draft/publish
- Public home page (the feed, filterable by meal type and tag) and post pages
- Sign-in with email and password; a sign-up page that shows "Sign up coming soon" (public sign-up closed, [ADR-0010](../adr/0010-dev-database-and-sign-in.md))
- Servings scaling and the metric/imperial toggle, including step tokens
- Grocery list grouped by grocery section, as a PDF (tickable checkboxes if the checkbox PDF spike works) and as an on-device checklist
- Instructions PDF, with step photos as an option
- Cook mode
- PWA: installable, recipes cached offline after viewing

## Out of scope for Phase 1

Reader accounts, creator accounts, follows and notifications, payments, merged grocery lists, meal planner, pantry tracking, premium printables. See [Future features](#future-features).

## Checklist

What Phase 1 needs, grouped so each group builds on the ones above it. It's an order of work, not a schedule. Tick an item when it's merged into `develop`.

### Decisions and spikes

- [x] Scope and data model: [ADR-0001](../adr/0001-post-and-recipe-are-separate.md) to [ADR-0010](../adr/0010-dev-database-and-sign-in.md)
- [x] USDA spike ([notes](../../notes/2026-10-01-usda-spike.md))
- [ ] Wireframes for the dashboard and the public pages, before the dashboard is built
- [ ] Checkbox PDF spike: which phone viewers keep the ticks (see [Open questions](#open-questions))
- [ ] Where image resizing runs, checked against Vercel's function size and time limits ([ADR-0007](../adr/0007-images.md))
- [ ] Neon Auth's email limits for verification and password reset ([ADR-0010](../adr/0010-dev-database-and-sign-in.md))

### Data foundation

- [x] Prisma schema and initial migration ([#1](https://github.com/Sheriff-A/la-cucina/pull/1))
- [x] Neon development branch, with sign-up disabled
- [x] USDA reference food import ([#2](https://github.com/Sheriff-A/la-cucina/pull/2))
- [x] Seed: units, grocery sections, starter canonical ingredients, two admins and two readers ([#2](https://github.com/Sheriff-A/la-cucina/pull/2))
- [ ] Reference data on production ([#3](https://github.com/Sheriff-A/la-cucina/issues/3)), after the backend work

### Sign-in and access

- [x] Email-and-password sign-in through Neon Auth
- [x] Profile found (or created) from the session; the role checked on the server by every admin route and server action ([ADR-0009](../adr/0009-profiles-and-roles.md))
- [x] Sign-up blocked on our server, and a sign-up page that shows "Sign up coming soon". The Neon Auth half is done: sign-up is disabled on every branch ([ADR-0010](../adr/0010-dev-database-and-sign-in.md))

### Images

- [ ] Uploads to R2 with signed URLs, resized to WebP at fixed widths ([ADR-0007](../adr/0007-images.md))

### Admin dashboard

- [ ] Dashboard shell
- [ ] Story (Tiptap), hero image and gallery editor ([ADR-0008](../adr/0008-story-editor-tiptap.md))
- [ ] Ingredient editor: canonical ingredient search, allowed units, "Other unit…", new canonical ingredients from reference foods. The highest-risk item.
- [ ] Step editor, with step photos and step tokens
- [ ] Publish check, and the post lifecycle: draft, unlisted, published, deleted ([ADR-0006](../adr/0006-post-lifecycle.md))

### Reading

- [ ] Feed, filtered by meal type and tag
- [ ] Post page, slugs and redirects ([ADR-0005](../adr/0005-post-slugs-and-redirects.md)), static generation and SEO

### Reader tools

- [ ] Servings scaling, the metric/imperial toggle and step tokens
- [ ] Grocery list, its PDF, and the on-device checklist
- [ ] Instructions PDF and cook mode
- [ ] PWA: installable, recipes cached offline after viewing

### Before launch

- [ ] Accessibility and performance, device testing
- [ ] First real recipes, analytics
- [ ] [Launch checklist](../../notes/launch-checklist.md): SMTP, domain, environment variables
- [ ] A first-time Google sign-in can't create an account ([#4](https://github.com/Sheriff-A/la-cucina/issues/4)), if the shared Google provider is still on

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
- **Checkbox PDFs.** Which phone viewers keep the ticks? This is the checkbox PDF spike in the [checklist](#decisions-and-spikes).
- ~~**Jira setup.** Which project, and how it connects to the ticketing skills.~~ Resolved 2026-09-27: Jira subscription lapsed; switched to GitHub Issues on this repo. See [docs/agents/issue-tracker.md](../agents/issue-tracker.md).
