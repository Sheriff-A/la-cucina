# 0010: Development database and sign-in

- **Status:** Accepted
- **Date:** 2026-10-01
- **Reasoning:** [notes/2026-09-30-recipe-structure-grilling.md](../../notes/2026-09-30-recipe-structure-grilling.md)

Amends two lines of [ADR-0000](0000-initial-decisions.md): "Docker locally on the same major version" (Database) and "The admin signs in with GitHub in Phase 1" (Auth). Builds on [ADR-0009](0009-profiles-and-roles.md).

## Development database

- **Running the app locally uses a Neon development branch, not Docker.** Neon Auth lives on the branch, so auth users and profiles are in the same database. The seed creates both, and resetting the branch clears both.
- **Docker Postgres stays for automated tests** (Vitest, Playwright in CI), with auth stubbed. It runs on the same Postgres major version as Neon.
- **Seeded data never reaches production.** The seed script refuses to run unless it targets a known development or preview branch, checked by branch, not just a flag. Development branches are never copied into production.
- How a development branch is reset, and the free plan's branch limits, are confirmed during setup.

## Sign-in

- **Email and password is the Phase 1 sign-in method.** Google, then GitHub, can be added as social providers. Neither is required for Phase 1, and Google matters more when the time comes.
- **Public sign-up is closed in Phase 1.** Every account is created deliberately, by the seed or by the owner. Seeded readers and admins exist so both views can be built and tested.
- **The sign-up UI is still built.** Submitting it shows a "Sign up coming soon" toast and creates nothing. Opening sign-up later is a switch, not new work.
- **Closing sign-up in the UI isn't enough**, because the auth API can be called directly. Sign-up is blocked in two places:
  1. **Neon Auth:** `disable_sign_up` is on in the email-and-password config of every branch (Console → Settings → Auth, `neon neon-auth config email-password update`, or the API). Production and development behave the same, so the "coming soon" flow is tested as it really works.
  2. **Our server:** the Next.js auth route rejects sign-up requests before forwarding them to Neon Auth, in case a branch's setting is ever wrong.
- **Accounts are created through the Neon API, CLI or Console**, which work with sign-up disabled. The seed uses the API.
- `disable_sign_up` belongs to the email-and-password config. When Google is added, check separately that a first-time Google sign-in can't create an account.

## Consequences

- Phase 1 environments: production (real accounts only), development and preview branches (seeded: two admins, two readers), Docker (tests only).
- Production email for verification and password reset comes from Neon Auth. Its limits are checked in week 2.
