# Coding

Conventions for this codebase, plus the index of LLM docs. For what's already built, see [components.md](components.md). For terms, see [CONTEXT.md](CONTEXT.md).

## Conventions

- **TypeScript strict mode** everywhere.
- **Domain logic stays out of the UI.** Unit conversion, scaling, step tokens, grocery lists and PDF building live in plain TypeScript modules with no React or Next.js imports. Components call them, route handlers and server actions call them. This keeps them testable and lets a separate backend replace them later without a rewrite ([ADR-0000](adr/0000-initial-decisions.md#no-separate-backend-in-phase-1)).
- **Store what the creator entered; convert only when rendering** ([ADR-0000](adr/0000-initial-decisions.md#units-stored-as-entered-converted-at-render)).
- **Names come from the glossary.** A `Follow` table, not `Subscription`; `IngredientLine`, not `RecipeItem`.
- **Reuse before building.** Check [components.md](components.md) first, and register new components in the same change that adds them.
- **Local database:** Docker Postgres on the same major version as Neon, with seed data. Reset freely.

## LLM docs index

LLM-oriented docs for our tools live in [llms/](llms/). Name each file `<tool>.txt` (or `<tool>-full.txt` for full versions) and add a row here when you add one.

| Tool | File | Source URL | Added |
|---|---|---|---|
| Next.js | _not added yet_ | | |
| Neon / Postgres | _not added yet_ | | |
| Better Auth | _not added yet_ | | |
| Serwist | _not added yet_ | | |
| Cloudflare R2 | _not added yet_ | | |
