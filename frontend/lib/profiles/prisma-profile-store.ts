// The ProfileStore backed by the `profiles` table. Never writes `role` on an existing profile:
// roles change only by a manual database change (ADR-0009).

import type { PrismaClient } from "@/app/generated/prisma/client";
import type { Profile, ProfileStore } from "@/lib/profiles/profile";

const select = {
  id: true,
  authUserId: true,
  role: true,
  displayName: true,
} as const;

export function prismaProfileStore(db: PrismaClient): ProfileStore {
  return {
    findByAuthUserId(authUserId): Promise<Profile | null> {
      return db.profile.findUnique({ where: { authUserId }, select });
    },
    async createReader(authUserId, displayName): Promise<Profile> {
      try {
        // An empty update makes this "create unless it exists": two first-sign-in requests
        // racing each other end up with one profile, and an existing role is left alone.
        return await db.profile.upsert({
          where: { authUserId },
          create: { authUserId, displayName, role: "reader" },
          update: {},
          select,
        });
      } catch (error) {
        if (isUniqueViolation(error)) {
          const existing = await db.profile.findUnique({
            where: { authUserId },
            select,
          });
          if (existing) return existing;
        }
        throw error;
      }
    },
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  );
}
