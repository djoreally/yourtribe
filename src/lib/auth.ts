import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter((origin): origin is string => Boolean(origin));

/**
 * Authentication is deliberately scoped to manager workspaces. Public patrons
 * never need an account to submit content through a tenant portal.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,
  advanced: {
    database: {
      joins: true,
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: false,
    }),
    // Keep this last so server actions can refresh Better Auth cookies.
    nextCookies(),
  ],
});
