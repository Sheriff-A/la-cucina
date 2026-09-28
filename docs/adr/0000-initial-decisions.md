# 0000: Initial decisions

- **Status:** Accepted
- **Date:** 2026-09-27

The decisions made during planning, before any code. Later ADRs start at 0001 and supersede sections of this record by name.

## Database: PostgreSQL only

MongoDB was considered. The data is relational (recipes, ingredient lines, canonical ingredients, users, roles, follows, later payments), and scaling, conversion and merged grocery lists need structured quantities. PostgreSQL only: Neon in production, Docker locally on the same major version. Flexible content such as the story's rich text goes in JSONB. No second database.

## No separate backend in Phase 1

Spring Boot is the preferred backend if one is ever needed. For Phase 1 (eight weeks, one developer, $0 budget), Next.js route handlers and server actions are enough, and a JVM service would add deployment work and cold-start problems on free hosting. Domain logic lives in framework-free TypeScript modules behind a service layer, so a separate API can replace the implementation later without rewriting the UI.

## Custom admin dashboard, no CMS

Payload CMS was considered. The dashboard is built in the Next.js app, so the editor can be shaped around canonical ingredients and step tokens, and so it can grow into the creator dashboard. This makes weeks 3–4 the heaviest.

## Auth: Better Auth

Auth.js was first proposed, but it's now maintained by the Better Auth team, who recommend Better Auth for new projects. Clerk and Auth0 were considered. Better Auth runs inside the app and stores users, accounts and sessions in our own Postgres, so there's no second service to sync with and no per-user cost. Sessions are database-backed with a sliding expiry, so they can be revoked. The admin signs in with GitHub in Phase 1.

**Amendment (2026-09-27):** Better Auth is provisioned as Neon Auth (Managed Better Auth) rather than self-hosted. Users and sessions still live in our own Neon Postgres branch (in a `neon_auth` schema), GitHub OAuth is still supported, and there's still no per-user cost — the reasons above are unaffected. The trade is Neon's own client wrapper (`@neondatabase/auth`) and a pinned plugin set in exchange for skipping self-hosted setup work. Image storage is unaffected by this: Cloudflare R2 stays, since Neon Object Storage bills egress and R2 was chosen specifically to avoid that (see below).

## Image storage: Cloudflare R2

Google Cloud Storage was considered. Storage prices are similar, but R2 has no egress fees, which removes the cost risk of popular posts. Storage sits behind one S3-compatible module, so switching providers is a configuration change.

## Hosting: free tiers for Phase 1

Vercel Hobby with the free `.vercel.app` subdomain, Neon free tier, R2 free tier. A custom domain comes when beta testers are invited. Vercel Hobby allows non-commercial use only, so hosting must change before any monetization.

## Units: stored as entered, converted at render

- Each recipe records its source unit system and displays in it by default. The reader's toggle overrides it and is remembered on their device.
- Quantities are stored exactly as entered. Converted values are never saved.
- **What converts:** mass (g, kg ↔ oz, lb) and true imperial volume (fl oz, pint, quart ↔ mL, L).
- **What doesn't:** kitchen units (tsp, tbsp, cup) and count units always display unchanged. A cup is 250 mL in Canadian metric recipes and about 237 mL in US ones, so converting it would imply false precision.
- **Order of operations:** scale for servings, then convert, then format.
- **Formatting:** friendly rounding and step-ups, e.g. 454 g shows as 1 lb and 1000 g as 1 kg.

## Step tokens

Values inside step text are tokens stored in their original unit and rendered for the reader's unit system:

- `{oven:180C}`: oven temperature, rounded to the nearest 25°F.
- `{temp:74C}`: exact temperature, rounded to 1°.
- `{len:5cm}`: lengths and pan sizes.

Publishing fails if a token can't be parsed. The recipe page, cook mode and PDFs all use the same renderer.

## Roles, entitlements and follows

This is not multi-tenancy: content is public and shared.

- **Roles.** Three roles: admin, creator, reader. Access is role-based, with ownership checks: every recipe has an `author_id`, and creators edit only their own recipes.
- **Entitlements.** Paid features are entitlements, tracked separately from roles in their own payment tables, backed by Stripe.
- **Follows.** Readers follow creators for free. "Subscription" is reserved for billing.

The Phase 1 schema includes the role column and `author_id`, even though only the admin exists.

## Grocery lists and downloads

One recipe, one grocery list, free and without sign-up. Merged lists across recipes are a paid feature for signed-up readers later. PDFs are generated in the browser. The checklist is saved on the reader's device.
