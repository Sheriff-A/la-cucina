# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`docs/CONTEXT.md`**: the project's glossary. Use these terms in code, UI and docs.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in. [0000](../adr/0000-initial-decisions.md) holds the initial planning decisions.
- **`docs/coding.md`**, **`docs/components.md`**: conventions and the existing/planned component registry — check before building anything new.

This repo is single-context (one app in `frontend/`, no per-context docs). `CLAUDE.md`'s "Where things are" table is the authoritative index; this file just tells skills how to use it.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `docs/CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding — per CLAUDE.md's rule, propose a new ADR that supersedes it instead.
