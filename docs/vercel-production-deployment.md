# Vercel Production Deployment

YourTribe is ready to deploy as a Next.js application on Vercel. The Content Pyramid schema has already been applied to the selected Neon project, so the deployment workflow should **not** automatically run the initial migration on every deployment; future schema changes should use an explicit, reviewed migration step.

## 1. Import the Repository

In the [Vercel dashboard](https://vercel.com/new), select **Add New → Project**, import `djoreally/yourtribe`, and retain the detected **Next.js** framework preset. Use the repository root as the Root Directory. Connect the production branch to `main`; Vercel creates Preview deployments for other branches and Production deployments for the configured production branch. [1]

## 2. Configure Production Variables

In **Project Settings → Environment Variables**, add the following values for the **Production** environment. Add equivalent, non-production values to Preview if you need authenticated Preview deployments. Environment-variable changes affect new deployments, so redeploy after saving them. [2]

| Variable | Production value | Exposure |
|---|---|---|
| `DATABASE_URL` | The **pooled** connection string for the committed Neon database and branch, with TLS required. | Server only |
| `BETTER_AUTH_SECRET` | A unique high-entropy secret. Generate it with `openssl rand -base64 32`. | Server only |
| `BETTER_AUTH_URL` | The exact canonical origin, such as `https://app.example.com`. No trailing slash. | Server only |
| `AYRSHARE_API_KEY` | Ayrshare server key, when live distribution is enabled. | Server only |
| `STORAGE_UPLOAD_ENDPOINT` | The server-side storage-signing service URL, when direct uploads are enabled. | Server only |

> Do not create `NEXT_PUBLIC_` copies of `DATABASE_URL`, `BETTER_AUTH_SECRET`, the Ayrshare key, or storage credentials. Variables with that prefix are embedded into browser code.

Vercel supplies `VERCEL_URL` for a deployment. The Better Auth configuration automatically trusts that deployment origin in addition to `BETTER_AUTH_URL`, allowing authenticated Preview testing without publishing a secret to the browser.

## 3. Configure Domains

Attach your production domain under **Project Settings → Domains**. Set `BETTER_AUTH_URL` to the final HTTPS domain before creating real manager accounts. If a Preview branch uses a custom domain, set that Preview domain’s `BETTER_AUTH_URL` value for that environment as well.

## 4. Deploy

Select **Deploy** in the dashboard, or push the current implementation to the connected production branch. The repository’s build script runs Prisma client generation and the Next.js build. The schema migration is intentionally separate because it has already been committed through Neon.

```bash
# Optional Vercel CLI path, after `vercel link`
vercel --prod
```

## 5. Verify Authentication

After deployment, open `/sign-up` and create a manager account. Then confirm these outcomes:

| Check | Expected outcome |
|---|---|
| `/dashboard` while signed out | Redirects to `/sign-in` through the Next.js proxy. |
| Successful sign-in | Creates a Better Auth session and returns to `/dashboard`. |
| Dashboard header | Shows the authenticated user’s initials and account menu. |
| Sign out | Clears the client session and returns to `/sign-in`. |
| Manager API route | Validates the server-side Better Auth session and tenant membership before returning tenant data. |

## Better Auth Frontend Integration

The frontend now has a small, explicit session layer. `AuthSessionProvider` wraps the root application layout and makes the reactive `useSession()` state from Better Auth available to client components. `AccountMenu` consumes that context, renders the current signed-in user, and calls the Better Auth client’s sign-out action. The dashboard is protected twice: the Next.js 16 proxy performs a fast cookie-presence redirect, while the dashboard server component performs the authoritative database-backed session check before rendering any workspace UI. [3]

## References

[1] [Vercel — Deploying Git Repositories](https://vercel.com/docs/deployments/git)

[2] [Vercel — Environment Variables](https://vercel.com/docs/environment-variables)

[3] [Better Auth — Next.js Integration](https://www.better-auth.com/docs/integrations/next)
