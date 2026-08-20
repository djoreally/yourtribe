# Content Pyramid Setup Guide

Content Pyramid is implemented as a **Next.js App Router** application with a multi-tenant PostgreSQL model, Better Auth manager accounts, public upload portals, and tenant-scoped manager APIs. The project preserves the existing repository routes for compatibility but replaces the root product experience with Content Pyramid.

## Application Routes

| Route | Audience | Purpose |
|---|---|---|
| `/` | Prospective business users | Explains the UGC collection and distribution workflow. |
| `/portal/ambler-brewing` | Patrons | Demonstrates the app-less, camera-first content submission portal. |
| `/dashboard` | Venue managers | Demonstrates review, channel selection, scheduling, and approval workflow. |
| `/sign-in`, `/sign-up` | Venue managers | Better Auth email/password entry points. |
| `/api/v1/portal/:tenantSlug` | Public client | Reads safe tenant branding and upload policy. |
| `/api/v1/submissions` | Public client | Validates consent and creates a pending UGC submission. |
| `/api/v1/manager/*` | Manager client | Enforces Better Auth session and tenant membership before mutation. |

## First-Time Setup

Copy the example environment file and supply the Neon pooled connection string plus a high-entropy Better Auth secret.

```bash
cp .env.example .env
```

> Better Auth expects a database-backed configuration and standard Next.js route handler under `/api/auth/[...all]`. The application uses the official Prisma adapter and organization plugin so each manager workspace can be represented as a Better Auth organization. [1] [2]

Then apply the Prisma migration to the **intended** Neon database. Do not run this command against an unrelated or production database until you have reviewed the migration.

```bash
npx prisma migrate deploy
```

The migration in `prisma/migrations/20260820160000_content_pyramid/` creates the Better Auth tables plus namespaced Content Pyramid tables: `cp_tenants`, `cp_tenant_members`, `cp_social_accounts`, `cp_media_assets`, and `cp_broadcast_logs`. The `cp_` namespace lets this backend coexist with the existing Neon project tables without replacing them. It also maintains the compatibility intake model used by existing repository routes.

## Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The public portal and dashboard use representative local data until `DATABASE_URL` is configured and migrated, which lets the interface be reviewed without a live connection.

## Production Integration Checklist

| Integration | Required action | Status in code |
|---|---|---|
| **Neon** | Set `DATABASE_URL` to a pooled Neon PostgreSQL URL and run the reviewed migration. | Ready for configuration. |
| **Better Auth** | Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`; manager authentication route and email forms are implemented. | Ready for configuration. |
| **Storage** | Implement a provider-specific signer in `/api/v1/upload/presigned-url`; return short-lived object upload URLs only. | API contract present; provider action pending. |
| **Ayrshare** | Set `AYRSHARE_API_KEY`, securely persist each tenant profile key, and complete OAuth profile onboarding. | Broadcast route posts to Ayrshare when configured. |
| **Processing worker** | Attach a queue-backed FFmpeg worker to create the vertical processed asset before broadcast. | Intentionally deferred to deployment infrastructure. |
| **Webhooks** | Add an authenticated Ayrshare webhook route with idempotent `hookId` handling. | Intentionally deferred to deployment infrastructure. |

## Tenant Isolation

The manager endpoints use `getCurrentTenantContext()` and `assertAssetInCurrentTenant()` before querying or mutating data. The lookup joins the authenticated Better Auth user to `TenantMember`, then filters every media asset by the selected tenant ID. This ensures a venue manager cannot approve, reject, schedule, or broadcast another tenant’s submission through the application API.

For stronger production defense-in-depth, provision the database with a restricted application role and add PostgreSQL row-level security policies that bind database queries to a tenant context. The application-level check should be retained even when RLS is enabled.

## References

[1] [Better Auth: Next.js integration](https://www.better-auth.com/docs/integrations/next)

[2] [Better Auth: Prisma adapter](https://www.better-auth.com/docs/adapters/prisma)

[3] [Better Auth: Organization plugin](https://www.better-auth.com/docs/plugins/organization)

[4] [Neon: Managed Better Auth and Next.js guide](https://neon.com/guides/neon-auth-nextjs)
