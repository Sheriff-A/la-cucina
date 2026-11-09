// The server-side admin check (ADR-0009). Call `await requireAdmin()` first thing in every
// admin page, layout, route handler and server action. Hiding things in the UI is not
// access control.

import "server-only";
import { forbidden, redirect } from "next/navigation";
import { checkAdminAccess } from "@/lib/auth/access";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import type { Profile } from "@/lib/profiles/profile";

/**
 * Returns the admin's profile. Signed-out visitors are sent to sign-in (and back to
 * `returnTo` afterwards); signed-in non-admins get a 403.
 */
export async function requireAdmin(returnTo = "/admin"): Promise<Profile> {
  const access = checkAdminAccess(await getCurrentProfile());
  if (access.allowed) return access.profile;
  if (access.reason === "signed-out")
    redirect(`/sign-in?next=${encodeURIComponent(returnTo)}`);
  forbidden();
}
