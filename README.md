# YourTribe

YourTribe is a multi-tenant platform for turning community moments into brand-safe social media. Visitors submit photos and short videos through a tenant-branded, app-less portal; venue managers review, approve, schedule, and distribute the best content through their connected channels.

## Product Surfaces

| Route | Audience | Purpose |
|---|---|---|
| `/` | Prospective partners | Explains the community-content workflow. |
| `/portal/ambler-brewing` | Patrons | Demonstrates the white-label, camera-first upload experience. |
| `/dashboard` | Venue managers | Provides authenticated content review and distribution controls. |
| `/sign-in`, `/sign-up` | Venue managers | Better Auth email/password account entry points. |

## Stack

The application uses **Next.js App Router**, **Better Auth**, **Prisma**, and **Neon PostgreSQL**. Tenant-scoped content tables use the `cp_` prefix so this platform can coexist safely with other data in the configured Neon project.

## Local Setup

```bash
cp .env.example .env.local
npm install
npx prisma generate
npm run dev
```

Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` before testing authenticated manager behavior. The included portal and landing experience can be reviewed without those values.

## Validation

```bash
npm run lint
npm run typecheck
npm run test:e2e
npm run build
```

## Deployment

See [`docs/vercel-production-deployment.md`](docs/vercel-production-deployment.md) for production setup and [`docs/vercel-preview-and-cicd.md`](docs/vercel-preview-and-cicd.md) for Preview environments and GitHub Actions deployment gates.
