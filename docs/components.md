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
| Unit list | `frontend/lib/units/unit-list.ts` | The fixed unit list (ADR-0003): stable codes, kinds, systems, exact gram/millilitre factors, and `withCounterparts` (allowing a mass/volume unit allows its other-system counterpart) | Seed, unit converter, admin editor | Built |
| Starting grocery sections | `frontend/lib/grocery/grocery-sections.ts` | The nine starting grocery sections in display order (ADR-0004 amendment). Seeds the table only; the table is the source of truth afterwards | Seed, grocery section suggester | Built |
| Grocery section suggester | `frontend/lib/usda/grocery-section-mapping.ts` | USDA food category → grocery section, with keyword overrides ("canned" → Canned & jarred, condiments, fresh herbs, leavening). Only prefills new canonical ingredients | Seed data generation, admin "new canonical ingredient" (planned) | Built |
| Portion parser | `frontend/lib/usda/portion-parser.ts` | USDA household portion text ("1 medium (2-1/2" dia)", "1 cup, chopped") → unit code and grams per unit; ignores what it can't place | Seed data generation, admin "new canonical ingredient" (planned) | Built |
| Profile from the session | `frontend/lib/profiles/profile.ts` | `findOrCreateProfile`: find a profile by its Neon Auth user ID, or create a reader on first sign-in; `displayNameFor` (name, else the email's local part). The store is passed in (ADR-0009) | Current profile, sign-in | Built |
| Profile store | `frontend/lib/profiles/prisma-profile-store.ts` | The `profiles` table behind `ProfileStore`. Creates readers only; never writes an existing profile's role | Current profile | Built |
| Admin access check | `frontend/lib/auth/access.ts` | `checkAdminAccess(profile)`: allowed, or refused as signed out / not an admin | `requireAdmin` | Built |
| Sign-up guard | `frontend/lib/auth/sign-up-guard.ts` | `isSignUpRequest(path)`: whether an auth-route request would create an account (ADR-0010) | Auth route | Built |
| Safe redirect path | `frontend/lib/auth/redirect-path.ts` | `safeRedirectPath(next)`: the `next` value if it is a path on this site, else `/` | Sign-in | Built |

## Server modules

Server-only (`import "server-only"`): Next.js, Neon Auth or database access. Keep the logic in the domain modules above.

| Name | Path | Purpose | Used by | Status |
|---|---|---|---|---|
| Neon Auth server | `frontend/lib/auth/server.ts` | `auth()`: the one `createNeonAuth` instance (Managed Better Auth), created on first use | Auth route, proxy, current profile, sign-in actions | Built |
| Auth route | `frontend/app/api/auth/[...path]/route.ts` | Proxies the browser's auth calls to Neon Auth; rejects sign-up with 403 `SIGN_UP_DISABLED` first | Browser auth calls | Built |
| Admin proxy | `frontend/proxy.ts` | Neon Auth's proxy on `/admin/*`: refreshes session cookies and sends signed-out visitors to sign-in. Not the access check | Admin pages | Built |
| Current profile | `frontend/lib/auth/current-profile.ts` | `getCurrentProfile()` (per request, null when signed out) and `profileForAuthUser(user)` | `requireAdmin`, sign-in | Built |
| `requireAdmin` | `frontend/lib/auth/require-admin.ts` | `await requireAdmin(returnTo)` first in every admin page, layout, route handler and server action: redirects signed-out visitors to sign-in, 403 (`forbidden()`) for non-admins, returns the admin's profile | Admin | Built |
| Sign-in actions | `frontend/lib/auth/actions.ts` | `signInWithEmail` (signs in, finds or creates the profile, redirects to `next`) and `signOut` | Sign-in form, sign-out button | Built |
| App Prisma client | `frontend/lib/db/prisma.ts` | `prisma()`: one client per server process over the pooled `DATABASE_URL`. Built by `createPrismaClient` in `lib/db/prisma-client.ts`, which the scripts share | Server modules | Built |

## UI components

| Name | Path | Purpose | Used by | Status |
|---|---|---|---|---|
| Button, Input, Label, Toaster | `frontend/components/ui/` | shadcn/ui (Base UI) primitives. `Toaster` (sonner) is mounted once in the root layout; call `toast()` from `sonner` | Everywhere | Built |
| Auth card | `frontend/components/auth/auth-card.tsx` | The centred panel the sign-in and sign-up pages sit in | Sign-in, sign-up pages | Built |
| Sign-in form | `frontend/components/auth/sign-in-form.tsx` | Email and password form posting to `signInWithEmail` | `/sign-in` | Built |
| Sign-up form | `frontend/components/auth/sign-up-form.tsx` | Name, email and password; submitting only shows "Sign up coming soon" (ADR-0010). Opening sign-up later means wiring it up here and removing the guard | `/sign-up` | Built |
| Sign-out button | `frontend/components/auth/sign-out-button.tsx` | Form posting to `signOut` | Admin, 403 page | Built |
