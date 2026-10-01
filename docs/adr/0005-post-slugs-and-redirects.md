# 0005: Post slugs and redirects

- **Status:** Accepted
- **Date:** 2026-09-30
- **Reasoning:** [notes/2026-09-30-recipe-structure-grilling.md](../../notes/2026-09-30-recipe-structure-grilling.md)

Links to posts get shared (texts, Pinterest, saved PDFs, search results). A broken link costs readers and search ranking, so URLs are treated as a contract.

## Decision

- **URL:** `/posts/<slug>`. Slugs are unique across all posts. The path says "posts" because recipes live inside posts ([ADR-0001](0001-post-and-recipe-are-separate.md)).
- **Draft:** the slug follows the title automatically.
- **Publish:** the slug freezes. Renaming a published post's title doesn't change its URL.
- **Manual change:** the admin can edit a published post's slug in the editor. Before saving, a confirmation dialog shows the old and new URLs and says that the old URL will redirect.
- **Redirects:** every slug a post has had is kept in a slug history table. A request for an old slug gets a permanent redirect to the current URL.
  - Redirects always point straight at the current slug: A → B, then B → C, sends A directly to C, never through a chain.
  - A slug in any post's history can't be taken by a different post, so an old link never lands on the wrong post.
  - The redirect lookup happens only when a slug isn't found as a current slug, so normal page loads don't pay for it.

## Later

A streamlined `/recipes/<slug>` view, showing only the recipe and its steps, is an idea for later. If built, it uses the same slug and the same redirect history.

## Consequences

- Schema: `Post.slug` (unique) and a slug history table (old slug, unique, pointing to the post).
- Tests must cover: renaming a published post keeps its URL; changing its slug redirects the old URL; chains collapse; a retired slug can't be reused by another post.
- What an unpublished or deleted post's URL returns is decided with the post lifecycle, not here.
