"use client";

// Closed sign-up (ADR-0010): the form is built so opening sign-up later is a switch, but in
// Phase 1 submitting it only shows "Sign up coming soon". It sends nothing anywhere.

import Link from "next/link";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SIGN_UP_COMING_SOON = "Sign up coming soon";

export function SignUpForm() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast(SIGN_UP_COMING_SOON);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
        />
      </div>
      <Button type="submit" size="lg">
        Sign up
      </Button>
      <p className="text-muted-foreground text-sm">
        Have an account?{" "}
        <Link href="/sign-in" className="text-foreground underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
