// Seeded users (ADR-0009, ADR-0010): two admins and two readers on a development or preview
// branch, for signing in and testing both roles.
//
// Each user is created in Neon Auth through the Neon API, which works with sign-up disabled.
// That API takes no password, so the seed then writes the user's Better Auth "credential"
// account row with a Better Auth password hash: the one place the seed writes into Neon's
// `neon_auth` schema, and only on branches the target check allows. Our migrations still
// never touch `neon_auth`. Finally the matching profile is upserted with the user's role.
//
// Credentials come from .env.seed.local (see .env.seed.example), never from docs or code.

import { hashPassword } from "better-auth/crypto";
import type { PrismaClient } from "@/app/generated/prisma/client";
import type { NeonApi } from "../neon-api";

type SeedRole = "admin" | "reader";

export interface SeedUser {
  email: string;
  name: string;
  password: string;
  role: SeedRole;
}

const SLOTS: readonly { prefix: string; role: SeedRole }[] = [
  { prefix: "SEED_ADMIN_1", role: "admin" },
  { prefix: "SEED_ADMIN_2", role: "admin" },
  { prefix: "SEED_READER_1", role: "reader" },
  { prefix: "SEED_READER_2", role: "reader" },
];

/** Reads the four seeded users from the environment; throws naming any missing variable. */
export function readSeedUsers(
  env: NodeJS.ProcessEnv = process.env,
): SeedUser[] {
  const missing: string[] = [];
  const users = SLOTS.map(({ prefix, role }) => {
    const get = (key: string) => {
      const value = env[`${prefix}_${key}`]?.trim();
      if (!value) missing.push(`${prefix}_${key}`);
      return value ?? "";
    };
    return {
      email: get("EMAIL").toLowerCase(),
      name: get("NAME"),
      password: get("PASSWORD"),
      role,
    };
  });
  if (missing.length > 0) {
    throw new Error(
      `Missing seed user settings: ${missing.join(", ")}. Add them to .env.seed.local (see .env.seed.example).`,
    );
  }
  if (new Set(users.map((u) => u.email)).size !== users.length) {
    throw new Error("Seed user emails must be different.");
  }
  return users;
}

async function findAuthUserId(
  prisma: PrismaClient,
  email: string,
): Promise<string | null> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id::text AS id FROM neon_auth."user" WHERE lower(email) = ${email} LIMIT 1`;
  return rows[0]?.id ?? null;
}

async function setPassword(
  prisma: PrismaClient,
  userId: string,
  password: string,
): Promise<void> {
  const hash = await hashPassword(password);
  const updated = await prisma.$executeRaw`
    UPDATE neon_auth.account SET password = ${hash}, "updatedAt" = now()
    WHERE "userId" = ${userId}::uuid AND "providerId" = 'credential'`;
  if (updated === 0) {
    await prisma.$executeRaw`
      INSERT INTO neon_auth.account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${userId}, 'credential', ${userId}::uuid, ${hash}, now(), now())`;
  }
}

export async function seedUsers(
  prisma: PrismaClient,
  api: NeonApi,
  branchId: string,
  users: readonly SeedUser[],
): Promise<void> {
  for (const user of users) {
    let authUserId = await findAuthUserId(prisma, user.email);
    const isNew = authUserId === null;
    if (authUserId === null) {
      authUserId = await api.createAuthUser(branchId, user.email, user.name);
    }
    await setPassword(prisma, authUserId, user.password);
    await prisma.profile.upsert({
      where: { authUserId },
      create: { authUserId, role: user.role, displayName: user.name },
      update: { role: user.role, displayName: user.name },
    });
    console.log(
      `  user ${user.email} (${user.role}): ${isNew ? "created" : "already there"}, password set`,
    );
  }
}
