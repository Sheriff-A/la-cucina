import type { Metadata } from "next";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Admin · La Cucina" };

// A placeholder until the dashboard shell: it proves the server-side role check.
export default async function AdminPage() {
  const admin = await requireAdmin("/admin");
  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <SignOutButton />
      </div>
      <p>Signed in as {admin.displayName}.</p>
    </main>
  );
}
