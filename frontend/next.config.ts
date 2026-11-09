import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // forbidden() for signed-in non-admins (lib/auth/require-admin.ts).
    authInterrupts: true,
  },
};

export default nextConfig;
