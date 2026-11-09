# Coding

Conventions for this codebase, plus the index of LLM docs. For what's already built, see [components.md](components.md). For terms, see [CONTEXT.md](CONTEXT.md).

## Conventions

- **TypeScript strict mode** everywhere.
- **Domain logic stays out of the UI.** Unit conversion, scaling, step tokens, grocery lists and PDF building live in plain TypeScript modules with no React or Next.js imports. Components call them, route handlers and server actions call them. This keeps them testable and lets a separate backend replace them later without a rewrite ([ADR-0000](adr/0000-initial-decisions.md#no-separate-backend-in-phase-1)).
- **Store what the creator entered; convert only when rendering** ([ADR-0000](adr/0000-initial-decisions.md#units-stored-as-entered-converted-at-render)).
- **Names come from the glossary.** A `Follow` table, not `Subscription`; `IngredientLine`, not `RecipeItem`.
- **Reuse before building.** Check [components.md](components.md) first, and register new components in the same change that adds them.
- **Databases:** run the app against a Neon development branch; Docker Postgres (same major version) is for automated tests and generating migrations ([ADR-0010](adr/0010-dev-database-and-sign-in.md)). Seed data never goes to production.
- **Seed and reference data:** see [Databases and seed data](#databases-and-seed-data) below.
- **Schema** (`frontend/prisma/schema.prisma`): models singular PascalCase, tables plural snake_case, columns snake_case, IDs UUIDv7. Rules Prisma can't express (CHECK constraints, case-insensitive uniqueness) go as raw SQL at the end of the migration that creates the table, and are listed in a comment on the model. Run Prisma commands with `--config prisma7.config.ts`.

## Databases and seed data

Neon project `shiny-violet-64947144` ([ADR-0010](adr/0010-dev-database-and-sign-in.md)):

| Where | What it's for | Env file (in `frontend/`, gitignored) |
|---|---|---|
| Neon branch `production` (`br-mute-queen-b7fdrdd4`) | Real accounts only. Never seeded. | Vercel only |
| Neon branch `development` (`br-lucky-leaf-b7zy0nrj`) | Running the app locally; seeded | `.env.development.local` ([example](../frontend/.env.example)) |
| Neon branches `preview/*` | Vercel previews; may be seeded | Vercel only |
| Docker Postgres (`docker compose up -d`, port 5434) | Automated tests and generating migrations | `.env.test.local` ([example](../frontend/.env.test.example)) |

`frontend/.env` is overwritten by `neon deploy` / `neon env pull`, so nothing reads it: Prisma, Next.js and the scripts read `.env.development.local`. Get its values with `neon env pull --branch development` (then copy them over) or from Console → Branches → development → Connect. Never point it at production. Sign-up is disabled on every branch (`neon neon-auth config email-password update --disable-sign-up true`); check a new branch before using it.

Commands, run from `frontend/`:

- `npx prisma migrate deploy --config prisma7.config.ts` applies migrations to the development branch (Prisma uses `DATABASE_URL_UNPOOLED`).
- `npm run db:migrate:new -- --name <name>` generates a new migration against Docker (reads `.env.test.local`).
- `npm run db:import-usda` imports USDA reference foods ([ADR-0004](adr/0004-usda-reference-foods-for-canonical-ingredients.md)). Needs `USDA_DATA_DIR` (or `--data-dir`): a folder holding the SR Legacy and Foundation Foods CSV folders from <https://fdc.nal.usda.gov/download-datasets/>. They aren't in the repo; the owner keeps them in `references/usda/`. Re-runnable; it never changes canonical ingredients and lists any whose reference food changed or disappeared.
- `npm run db:seed` seeds units, grocery sections, the starter canonical ingredients (`frontend/prisma/seed/data/starter-canonical-ingredients.ts`) and two admins and two readers. Run the import first. Re-runnable: it creates what's missing and never edits existing ingredients or sections.

Both scripts read `.env.development.local` plus `.env.seed.local` ([example](../frontend/.env.seed.example)): `NEON_API_KEY`, `USDA_DATA_DIR` and the seeded users' test credentials. Never put those in docs, code or chat.

**The production guard.** Before writing, both scripts look up the Neon branch behind the database URL through the Neon API. The seed refuses production (by branch ID, by the name `production`, and as the default/primary branch) and any branch that isn't `development` or `preview/*`. To seed a new development branch, add its ID to `DEVELOPMENT_BRANCH_IDS` in `frontend/prisma/seed/target.ts`. The USDA import, being reference data only, can go to production with `--allow-production`. A local Postgres is allowed; users are skipped there because it has no Neon Auth.

**Seeded users.** The Neon API creates auth users without a password, so the seed then writes each user's Better Auth `credential` account row (hashed with `better-auth/crypto`) into `neon_auth.account`. This is the only write into Neon's schema, and it only happens on branches the guard allows. Migrations never touch `neon_auth` ([ADR-0009](adr/0009-profiles-and-roles.md)).

**Resetting the development branch.** Reset it from its parent (Console → Branches → development → Reset from parent), or delete it and create a new one. Either way you get production's state, so then run `migrate deploy`, `db:import-usda` and `db:seed`. A new branch gets a new ID, which has to go in `DEVELOPMENT_BRANCH_IDS`, with sign-up disabled.

## LLM docs index

LLM-oriented docs for our tools live in [llms/](llms/). Name each file `<tool>.txt` (or `<tool>-full.txt` for full versions) and add a row here when you add one.

| Tool | File | Source URL | Added |
|---|---|---|---|
| Next.js | [nextjs-llms.txt](llms/nextjs-llms.txt) | _TBD_ | 2026-09-27 |
| shadcn/ui | [shadcn-llms.txt](llms/shadcn-llms.txt) | _TBD_ | 2026-09-27 |
| Better Auth | [better-auth-llms.md](llms/better-auth-llms.md) | _TBD_ | 2026-09-27 |
| Neon / Postgres | _not added yet_ | | |
| Serwist | _not added yet_ | | |
| Tiptap | _not added yet: needed before the week 3 story editor ([ADR-0008](adr/0008-story-editor-tiptap.md))_ | | |
| Cloudflare R2 | _not added yet_ | | |
