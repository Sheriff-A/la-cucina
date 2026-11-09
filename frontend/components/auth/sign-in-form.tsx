"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail, type SignInState } from "@/lib/auth/actions";

export function SignInForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(
    signInWithEmail,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          // Remount when a failed attempt echoes the email back, so the uncontrolled
          // field picks up the new default value.
          key={state.email ?? ""}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.error ? (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-muted-foreground text-sm">
        No account?{" "}
        <Link href="/sign-up" className="text-foreground underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
