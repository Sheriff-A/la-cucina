// Prisma CLI config. Run Prisma commands with `--config prisma7.config.ts`.
//
// Loads .env.development.local, which points at the Neon development branch (ADR-0010),
// rather than the bare .env, because `neon deploy` / `neon env pull` overwrite .env wholesale.
// Variables already set in the environment win, so `node --env-file=.env.test.local …`
// (see the db:migrate:new script) points the CLI at the Docker Postgres instead.
//
// Migrations use the direct (unpooled) connection when there is one: Prisma Migrate needs
// session-level features that Neon's pooler doesn't offer.
import { config } from "dotenv";
config({ path: ".env.development.local", quiet: true });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed/index.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL_UNPOOLED"] ?? process.env["DATABASE_URL"],
  },
});
