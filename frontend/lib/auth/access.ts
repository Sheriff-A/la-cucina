// Role checks (ADR-0009). Plain TypeScript: the Next.js side (redirects, 403s) is in
// require-admin.ts. Hiding things in the UI is not access control; every admin route and
// server action goes through these on the server.

import type { Profile } from "@/lib/profiles/profile";

export type AdminAccess =
  | { allowed: true; profile: Profile }
  | { allowed: false; reason: "signed-out" | "not-admin" };

/** Whether the current visitor (null when signed out) may use the admin. */
export function checkAdminAccess(profile: Profile | null): AdminAccess {
  if (!profile) return { allowed: false, reason: "signed-out" };
  if (profile.role !== "admin") return { allowed: false, reason: "not-admin" };
  return { allowed: true, profile };
}
