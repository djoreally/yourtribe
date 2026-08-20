import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";
import { queueAuthEmail } from "@/lib/auth-email";

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
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url, token }) => {
      queueAuthEmail({
        to: user.email,
        subject: "Reset your Northstar password",
        title: "Reset your password",
        message: "We received a request to reset the password for your Northstar manager account.",
        actionLabel: "Reset password",
        actionUrl: url,
        event: "reset-password",
        idempotencyKey: `reset-password/${token}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      queueAuthEmail({
        to: user.email,
        subject: "Verify your Northstar email",
        title: "Verify your email address",
        message: "Confirm your email address to activate your Northstar manager workspace.",
        actionLabel: "Verify email",
        actionUrl: url,
        event: "verify-email",
        idempotencyKey: `verify-email/${token}`,
      });
    },
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
