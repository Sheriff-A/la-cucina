# 0006: Post lifecycle

- **Status:** Accepted
- **Date:** 2026-09-30
- **Reasoning:** [notes/2026-09-30-recipe-structure-grilling.md](../../notes/2026-09-30-recipe-structure-grilling.md)

## Statuses

A post has one status. Deletion is tracked separately.

| Status | URL for anyone | Home page, sitemap, search engines | Slug |
|---|---|---|---|
| **Draft** | 404 | No | Follows the title |
| **Unlisted** | Works | No, and the page is marked `noindex` | Frozen |
| **Published** | Works | Yes | Frozen |

- **Unpublishing** means setting a post back to Draft. It keeps its slug and slug history, so republishing brings the same URL back ([ADR-0005](0005-post-slugs-and-redirects.md)).
- **Unlisted** is for sharing by direct link. Slugs are readable, so an unlisted URL can be guessed; that's accepted, and there's no share key.
- Edits to Unlisted and Published posts go live on save, and the editor shows the live banner for both ([ADR-0002](0002-published-edits-go-live-immediately.md)).
- No scheduled publishing in Phase 1.

## Deletion

- **Soft delete** sets `deletedAt`; null means not deleted. A deleted post disappears from the site and the admin's normal lists, whatever its status.
- Its URL returns **410 Gone** with a friendly "this post was removed" page. Its slugs stay reserved.
- **Restore** from the admin is possible until the post is permanently deleted. A restored post keeps its status.
- **Permanent deletion** removes the post and its R2 images. It's deliberate and admin-only, e.g. a trash view or a cleanup of posts deleted more than 30 days ago. Not needed for launch.

## Dates

- **`publishedAt`**: set every time a post becomes Published, from Draft or Unlisted. Readers see it and the home page sorts by it, so republishing brings a post back to the top. Null until the first publish; Unlisted posts show no date.
- **`firstPublishedAt`**: set on the first publish, never changed. Not shown to readers.
- **`updatedAt`**: internal. Given to search engines as the modified date in structured data, never shown on the page, in line with ADR-0002.

With several creators, repeated unlist/republish could be used to game the home page. Revisit this then.

## Consequences

- Schema: `Post.status` enum (draft, unlisted, published), `deletedAt`, `publishedAt`, `firstPublishedAt`, `updatedAt`.
- Every reader-facing query filters on `status` and `deletedAt`. That filter should live in one place in the post service, not in each query.
