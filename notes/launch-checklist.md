---
type: checklist
created: 2026-10-01
tags: [launch, phase-1, ops]
related: ["[[2026-09-30-recipe-structure-grilling]]"]
---

# Launch checklist

Things to do outside the code before Phase 1 launch (target 2026-11-21). Tick them off as they're done. Background: [ADR-0009](../docs/adr/0009-profiles-and-roles.md), [ADR-0010](../docs/adr/0010-dev-database-and-sign-in.md).

## Auth

- [x] Disable sign-up on the `production` branch (Neon Auth, email and password). Done 2026-10-01.
- [x] Disable sign-up on the `preview/develop` branch. Done 2026-10-01.
- [ ] Create your own account on the `production` branch: Neon Console → la-cucina → production → Auth → Users. You choose the password.
- [ ] After the schema exists: set your profile's role to `admin` in the production database.
- [ ] Revisit the `vercel-dev` branch later. It probably came from connecting Neon to Vercel and has no Neon Auth. Leaving it for now (2026-10-01).
- [ ] Check that new Vercel preview branches also have sign-up disabled. If they don't inherit it, the server-side block in ADR-0010 is the only protection there.
- [ ] Set up custom SMTP for Neon Auth on production, so verification and password-reset emails don't use Neon's shared sender. See https://neon.com/docs/auth/production-checklist.md
- [ ] Add the production domain (the `.vercel.app` URL) to Neon Auth's trusted domains.
- [ ] When Google sign-in is added: confirm a first-time Google sign-in can't create an account.

## Vercel

- [ ] Production environment variables: `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET` (generate your own, 32+ characters).
- [ ] Confirm the seed can't run against production (the seed script's branch check).
