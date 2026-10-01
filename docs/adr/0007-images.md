# 0007: Images

- **Status:** Accepted
- **Date:** 2026-10-01
- **Reasoning:** [notes/2026-09-30-recipe-structure-grilling.md](../../notes/2026-09-30-recipe-structure-grilling.md)

Builds on [ADR-0000](0000-initial-decisions.md#image-storage-cloudflare-r2): images live in Cloudflare R2 behind one S3-compatible module.

## Decision

- **One `Image` table** for every image: R2 key, width, height, alt text, optional caption, uploader. The hero image is a reference on the post, the gallery is an ordered list on the post, and a step photo is a reference on the step.
- **What's required:** a post needs a hero image to be unlisted or published. The gallery is optional: a post can have a hero and no gallery images. Step photos are optional: any step may have one or not.
- **The hero image** also serves as the post's thumbnail on the feed and in link previews.
- **Alt text is required to publish, not to upload.** Drafts may have images without alt text. Moving a post to Unlisted or Published fails until every image it uses has alt text.
- **Captions** are optional and shown under gallery images.
- **Resize once, at upload.** Each upload is converted to WebP at a few fixed widths (e.g. 640, 1280, 1920 px) and stored in R2. Pages serve them through `srcset`. This doesn't use Vercel's image optimization, so its monthly limit on the Hobby plan doesn't apply.
- **Direct upload.** The browser uploads the original to R2 with a short-lived signed URL, so large photos don't pass through a Vercel function. Resizing then runs on the server.
- **Cleanup later.** Replaced or removed images, and images of permanently deleted posts ([ADR-0006](0006-post-lifecycle.md)), stay in R2 until a cleanup job removes unreferenced ones. Not needed for launch.

## Consequences

- Schema: `Image`; `Post.heroImageId`; a gallery join table with position; `Step.photoId`.
- Where resizing runs (a route handler with `sharp`, or something else) is checked against Vercel's function size and time limits during week 2.
- The publish check (hero present, alt text on all images, step tokens parse) lives in one place in the post service.
