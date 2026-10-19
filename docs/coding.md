# Coding

Conventions for this codebase, plus the index of LLM docs. For what's already built, see [components.md](components.md). For terms, see [CONTEXT.md](CONTEXT.md).

## Conventions

- **TypeScript strict mode** everywhere.
- **Domain logic stays out of the UI.** Unit conversion, scaling, step tokens, grocery lists and PDF building live in plain TypeScript modules with no React or Next.js imports. Components call them, route handlers and server actions call them. This keeps them testable and lets a separate backend replace them later without a rewrite ([ADR-0000](adr/0000-initial-decisions.md#no-separate-backend-in-phase-1)).
- **Store what the creator entered; convert only when rendering** ([ADR-0000](adr/0000-initial-decisions.md#units-stored-as-entered-converted-at-render)).
- **Names come from the glossary.** A `Follow` table, not `Subscription`; `IngredientLine`, not `RecipeItem`.
- **Reuse before building.** Check [components.md](components.md) first, and register new components in the same change that adds them.
- **Databases:** run the app against a Neon development branch; Docker Postgres (same major version) is for automated tests and generating migrations ([ADR-0010](adr/0010-dev-database-and-sign-in.md)). Seed data never goes to production.
- **Schema** (`frontend/prisma/schema.prisma`): models singular PascalCase, tables plural snake_case, columns snake_case, IDs UUIDv7. Rules Prisma can't express (CHECK constraints, case-insensitive uniqueness) go as raw SQL at the end of the migration that creates the table, and are listed in a comment on the model. Run Prisma commands with `--config prisma7.config.ts`.

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
