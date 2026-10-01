# 0008: Story editor: Tiptap

- **Status:** Accepted
- **Date:** 2026-10-01
- **Reasoning:** [notes/2026-09-30-recipe-structure-grilling.md](../../notes/2026-09-30-recipe-structure-grilling.md)

Builds on [ADR-0000](0000-initial-decisions.md#database-postgresql-only): the story's rich text is stored as JSONB.

## Decision

The story is written in a **Tiptap** editor and stored as Tiptap's JSON document in a JSONB column on the post.

- **Allowed formatting:** paragraphs, headings (two levels), bold, italic, links, bulleted and numbered lists, block quotes. The editor offers nothing else, so stored stories never contain formatting the site can't render.
- **Not allowed:** images in the story (the gallery is for those), tables, colours, fonts, embeds.
- **No length limit.** The feed and link previews use a plain-text excerpt of about 160 characters, made from the stored JSON.
- The same JSON is rendered on the server for the post page, and later for PDFs if the story is included.

Markdown was considered. It's simpler to build, but it would mean parsing and sanitizing on every render, and a toolbar suits writing a backstory better. Lexical was considered too. It would work, but has fewer ready-made React examples.

## Consequences

- Tiptap's LLM docs must be added to `docs/llms/` before the week 3 editor work (tracked in [coding.md](../coding.md#llm-docs-index)).
- Adding a formatting type later means updating both the editor and the renderer. Existing stories keep working.
