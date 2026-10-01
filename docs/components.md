# Components

The registry of everything reusable, so nothing gets built twice. Check here before building. Add or update a row in the same change that creates or changes a component.

**Status:** Planned · In progress · Built · Deprecated

## Domain modules

Plain TypeScript with no UI imports (see [coding.md](coding.md)).

| Name | Path | Purpose | Used by | Status |
|---|---|---|---|---|
| Unit converter | | Convert quantities between unit systems per the units rules in ADR-0000 | Recipe page, grocery list, PDFs | Planned |
| Quantity formatter | | Friendly rounding, fractions and unit step-ups (1000 g → 1 kg) | Unit converter, UI | Planned |
| Servings scaler | | Scale ingredient lines from base servings | Recipe page, grocery list, PDFs | Planned |
| Step token renderer | | Parse and render `{oven:}`, `{temp:}`, `{len:}` tokens | Recipe page, cook mode, PDFs | Planned |
| Grocery list builder | | Group ingredient lines by grocery section | Grocery list, checklist, PDF | Planned |
| PDF builders | | Grocery list and instructions PDFs | Download buttons | Planned |
| Image storage client | | Upload and fetch images through one S3-compatible interface (R2 today); signed upload URLs | Admin editor, recipe pages | Planned |
| Image resizer | | Convert an uploaded image to WebP at fixed widths and store them (ADR-0007) | Image upload | Planned |
| Publish check | | Validate a post before unlisting/publishing: hero present, alt text on every image, step tokens parse | Admin editor | Planned |

## UI components

| Name | Path | Purpose | Used by | Status |
|---|---|---|---|---|
| | | | | |
