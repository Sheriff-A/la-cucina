// The signed-in visitor's profile, read on the server (ADR-0009). Finds the profile by the
// session's Neon Auth user ID and creates a reader profile on a user's first sign-in.

import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db/prisma";
import { prismaProfileStore } from "@/lib/profiles/prisma-profile-store";
import {
  findOrCreateProfile,
  type AuthUser,
  type Profile,
} from "@/lib/profiles/profile";

/** The profile for a Neon Auth user, created as a reader if it doesn't exist yet. */
export function profileForAuthUser(user: AuthUser): Promise<Profile> {
  return findOrCreateProfile(prismaProfileStore(prisma()), user);
}

/** The current visitor's profile, or null when signed out. Cached per request. */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  // The session comes from the request's cookies: never prerender past this point.
  await connection();
  const { data: session } = await auth().getSession();
  const user = session?.user;
  if (!user) return null;
  return profileForAuthUser(user);
});
