# La Cucina

A personal meal-posting PWA. Each post is a recipe with a backstory: hero image, story, gallery, then ingredients and steps. Readers can scale servings, switch metric/imperial, download a grocery list and instructions as PDFs, and cook from their phone. Built for a single creator (the owner) first, with multi-creator support and additional tools planned later.

**Stack:** Next.js (App Router, TypeScript) · PostgreSQL (Neon; Docker locally) · Cloudflare R2 for images · Better Auth · Vercel. No separate backend in Phase 1. Reasons for all of these are in [ADR-0000](docs/adr/0000-initial-decisions.md).

## Where things are

Everything except this file lives in `docs/`.

| Path | What it's for |
|---|---|
| [docs/CONTEXT.md](docs/CONTEXT.md) | Glossary: the project's agreed terms. Use these words in code, UI and docs. |
| [docs/coding.md](docs/coding.md) | Coding conventions and an index of the LLM docs in `docs/llms/`. |
| [docs/components.md](docs/components.md) | Registry of components and modules that exist or are planned. |
| [docs/adr/](docs/adr/) | Architecture decision records. [0000](docs/adr/0000-initial-decisions.md) holds the planning decisions; new ones start at 0001. |
| [docs/design/](docs/design/) | Flows, wireframes, scope and planning notes. |
| [docs/llms/](docs/llms/) | LLM-oriented docs (llms.txt files) for the tools we use. |

## Rules for agents

- Before building a component or module, check [components.md](docs/components.md). Reuse or extend what exists; register anything new in the same change.
- Before using a framework or library API, check whether `docs/llms/` has docs for it (indexed in [coding.md](docs/coding.md)) and prefer those over memory.
- Name things with the terms in [CONTEXT.md](docs/CONTEXT.md). If a needed term is missing or ambiguous, raise it instead of inventing one.
- Don't contradict an accepted ADR. If a change needs to, propose a new ADR that supersedes it.
- Issue tracking is GitHub Issues, on this repo.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues, on this repo. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `docs/CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
