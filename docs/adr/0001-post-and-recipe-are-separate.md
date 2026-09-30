# 0001: Post and Recipe are separate entities

- **Status:** Accepted
- **Date:** 2026-09-29
- **Reasoning:** [notes/2026-09-29-open-questions-grilling.md](../../notes/2026-09-29-open-questions-grilling.md)

## Decision

A **Post** is the published piece of content: title, slug, story, hero image, gallery, author and draft/published state. A **Recipe** is an optional part of a post: base servings, source unit system, ingredient lines and steps. Data model: `Post` has zero or one `Recipe`.

- **Phase 1:** every post has a recipe. The admin editor creates both together. This is an application rule, not a database constraint, so the relation stays optional.
- **Later:** posts without a recipe are allowed, e.g. a review of a dish eaten at a restaurant. The author can add a recipe to the post afterwards, once they've worked out how to make it.

## Why

The owner wants other people to post about meals in general, not only meals they cook, and to attach a recipe later. With a single `Recipe` table, that would mean moving slugs, URLs, publish state and the story/hero/gallery to a new table after real posts and shared links exist. Splitting now costs one extra table and one join.

## Consequences

- Slug, URL, `author_id` and draft/published state live on `Post`. This amends [ADR-0000](0000-initial-decisions.md#roles-entitlements-and-follows), which said every recipe has an `author_id`: ownership checks apply to the post, and its recipe follows.
- Readers' tools (scaling, unit toggle, grocery list, instructions PDF, cook mode) only appear on posts that have a recipe.
- Story, hero and gallery belong to the post. For a review-only post the story is the review text.
