Next.js App Router + TypeScript, on this stack:

- **Database:** Prisma ORM → Postgres. Local dev runs against Docker; Neon in production.
- **Auth:** Neon Auth (Managed Better Auth).
- **UI:** Tailwind CSS v4 + shadcn/ui.
- **Testing:** Vitest (unit/component) + Playwright (e2e).
- **Infra-as-code:** `neon.ts` (Neon services) via the Neon CLI/MCP.

## Getting started

```bash
docker compose up -d   # from the repo root: starts local Postgres on :5434
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment files

Neon's tooling (`neon deploy`, `neon env pull`, `neon checkout`) freely rewrites `.env` with the _linked Neon branch's_ variables (`DATABASE_URL`, `NEON_AUTH_*`, …) — don't hand-edit those values in `.env`, they'll be overwritten on the next `neon deploy`.

Local development instead reads the database URL from **`.env.development.local`** (gitignored, not touched by Neon tooling), which both Next.js and Prisma load explicitly — see the comment in `prisma7.config.ts`. This keeps local dev on Docker Postgres per [ADR-0000](../docs/adr/0000-initial-decisions.md), while `.env`'s Neon `DATABASE_URL` remains available for anything that intentionally wants the cloud branch (or as the value to copy into Vercel's own env config for deploys — Vercel doesn't read these files).

See `.env.example` for the full list of variables a fresh clone needs.

## Database (Prisma + Docker)

```bash
npx prisma studio        # browse local data
npx prisma migrate dev   # after changing prisma/schema.prisma
```

The generated client lives at `app/generated/prisma` (gitignored, regenerated automatically on `npm install` via the `postinstall` script).

## Auth (Neon Auth)

Enabled in `neon.ts` (`auth: true`) and provisioned on the linked branch. Not yet wired into any sign-in UI — that's app-specific work for whenever the admin login flow gets built. See the `neon-auth` skill for implementation steps (`@neondatabase/auth` is already installed).

## UI components (shadcn/ui)

```bash
npx shadcn@latest add <component>
```

## Testing

```bash
npm run test                        # Vitest, watch mode
npx vitest run                      # Vitest, single run
npx playwright test                 # Playwright e2e (builds + starts the app automatically)
```

## Neon MCP

`.mcp.json` gives Claude Code (or another supported agent) direct access to this Neon project (scoped to this project's ID). Sign-in happens via OAuth on first use — no key stored in the repo.

## Cloning this as a template for a new project

- `docker-compose.yml` (repo root): rename the database and adjust the port if it collides locally.
- `frontend/.neon` and `frontend/neon.ts`: unlink and re-provision a new Neon project (`neon init` / `neon link`).
- `frontend/.mcp.json`: update the `projectId` query param, or re-run `neon mcp` for the new project.
- `frontend/prisma/schema.prisma`: still has no models — start there.
