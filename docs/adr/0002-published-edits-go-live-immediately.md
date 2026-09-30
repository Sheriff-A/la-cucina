# 0002: Published edits go live immediately

- **Status:** Accepted
- **Date:** 2026-09-29
- **Reasoning:** [notes/2026-09-29-open-questions-grilling.md](../../notes/2026-09-29-open-questions-grilling.md)

## Decision

Saving an edit to a published post makes it live at once, whatever the size of the edit. There is no pending revision, no staged copy and no revision history in Phase 1, and readers see no "Updated" notice.

- To rework a post privately, the owner sets it back to draft, edits, and republishes.
- The admin editor shows a banner or badge at the top of the edit page of any published post, saying the post is live and saved edits are reflected immediately.

## Why

The owner is the only creator, so there's no approval step to build. Revisions and diffs would add to the editor in weeks 3–4, the heaviest stretch of the plan. Draft/publish already covers working on a new post before it goes live.

## Later: audit log

An admin-only audit log table, recording who changed which record and when, is wanted for when demand for history appears. It is not in Phase 1. Because it works at the record level, it needs nothing from the Phase 1 schema beyond ordinary IDs and timestamps. Ingredient lines and steps already have stable IDs. If history ever needs to be readable by creators or readers, that would be a new ADR.

## Consequences

- No revision tables or "pending" state in the Prisma schema.
- Publishing state and editing are independent: a post stays published while it is edited.
