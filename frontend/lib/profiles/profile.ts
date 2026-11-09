// Profile from the session (ADR-0009). Plain TypeScript: no React, Next.js or Prisma imports.
// The store is passed in so this logic is testable without a database.

export type Role = "admin" | "creator" | "reader";

/** Our record of a user (docs/CONTEXT.md). */
export interface Profile {
  id: string;
  authUserId: string;
  role: Role;
  displayName: string;
}

/** The parts of a Neon Auth user that a profile is made from. */
export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

export interface ProfileStore {
  findByAuthUserId(authUserId: string): Promise<Profile | null>;
  /**
   * Creates a reader profile for the auth user, or returns the existing one if another
   * request created it first. Never changes an existing profile's role.
   */
  createReader(authUserId: string, displayName: string): Promise<Profile>;
}

const MAX_DISPLAY_NAME_LENGTH = 80;

/** The display name a new profile starts with: the auth user's name, else the email's local part. */
export function displayNameFor(user: AuthUser): string {
  const name = user.name?.trim();
  if (name) return name.slice(0, MAX_DISPLAY_NAME_LENGTH);
  const localPart = user.email?.split("@")[0]?.trim();
  if (localPart) return localPart.slice(0, MAX_DISPLAY_NAME_LENGTH);
  return "Reader";
}

/**
 * Finds the profile for a signed-in auth user, creating it on their first sign-in.
 * Everyone starts as a reader; the app never grants or changes roles (ADR-0009).
 */
export async function findOrCreateProfile(
  store: ProfileStore,
  user: AuthUser,
): Promise<Profile> {
  const existing = await store.findByAuthUserId(user.id);
  if (existing) return existing;
  return store.createReader(user.id, displayNameFor(user));
}
