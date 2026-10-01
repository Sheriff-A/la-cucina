# 0009: Profiles and roles

- **Status:** Accepted
- **Date:** 2026-10-01
- **Reasoning:** [notes/2026-09-30-recipe-structure-grilling.md](../../notes/2026-09-30-recipe-structure-grilling.md)

Builds on [ADR-0000](0000-initial-decisions.md#roles-entitlements-and-follows) (three roles; the role column and `author_id` are in the Phase 1 schema) and its Neon Auth amendment (users live in the Neon-managed `neon_auth` schema).

## Decision

- **A `Profile` table in our own schema**, one row per auth user. It stores `authUserId`, the Neon Auth user's ID (unique), plus the **role** (an enum: admin, creator, reader) and a display name. `Post.authorId` points to `Profile`.
- **No database foreign keys into `neon_auth`.** That schema belongs to Neon, and our Prisma migrations neither reference nor change it. The app creates the profile on a user's first sign-in, and `authUserId` is how a session finds its profile.
- **Roles live in our table**, not in Neon Auth, so the access rules sit next to the data they protect.
- **Everyone who signs up is a reader.** In Phase 1, a reader can do nothing that needs an account.
- **Becoming an admin is a manual database change** by the owner. The app has no way to grant or change roles.
- **Every admin route and server action checks the role on the server.** Hiding things in the UI is not access control.

## Seed data

Development and preview databases are seeded with **two admins and two readers**, for signing in and testing both roles. The seed never runs against production.

## Consequences

- The server-side role check is what protects the admin, whatever sign-in methods exist.
- Seeded test users sign in with email and password; their credentials go in the project's seed config, not in docs or chat.
- Sign-in methods, closed sign-up and the development database are settled in [ADR-0010](0010-dev-database-and-sign-in.md).
