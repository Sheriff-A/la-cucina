import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { safeRedirectPath } from "@/lib/auth/redirect-path";

export const metadata: Metadata = { title: "Sign in · La Cucina" };

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const { next } = await searchParams;
  return (
    <AuthCard title="Sign in">
      <SignInForm next={safeRedirectPath(next)} />
    </AuthCard>
  );
}
