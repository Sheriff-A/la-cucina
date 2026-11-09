"use server";

// Sign-in and sign-out as Server Actions. Signing in on the server lets us find or create the
// profile in the same step (ADR-0009), and Server Actions may set the session cookies.

import { redirect } from "next/navigation";
import { profileForAuthUser } from "@/lib/auth/current-profile";
import { safeRedirectPath } from "@/lib/auth/redirect-path";
import { auth } from "@/lib/auth/server";

export interface SignInState {
  error?: string;
  email?: string;
}

export async function signInWithEmail(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirectPath(formData.get("next"));

  if (!email || !password)
    return { error: "Enter your email and password.", email };

  let result: Awaited<ReturnType<ReturnType<typeof auth>["signIn"]["email"]>>;
  try {
    result = await auth().signIn.email({ email, password });
  } catch (error) {
    console.error("[sign-in] Neon Auth request failed", error);
    return { error: "Sign-in isn't working right now. Try again.", email };
  }

  const user = result.data?.user;
  if (result.error || !user) {
    if (result.error && (result.error.status ?? 0) >= 500)
      console.error("[sign-in] Neon Auth error", result.error);
    return { error: "That email and password don't match.", email };
  }

  await profileForAuthUser(user);
  redirect(next);
}

export async function signOut(): Promise<void> {
  await auth().signOut();
  redirect("/");
}
