import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";

// Rendered with a 403 when requireAdmin() refuses a signed-in non-admin.
export default function Forbidden() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Not allowed</h1>
      <p className="text-muted-foreground">
        Your account can&apos;t open this page.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/" className="underline">
          Home
        </Link>
        <SignOutButton />
      </div>
    </main>
  );
}
