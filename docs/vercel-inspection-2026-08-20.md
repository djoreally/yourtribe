# Vercel Inspection — 2026-08-20

The signed-in Vercel account contains the dedicated **YourTribe** project, connected to `djoreally/yourtribe`.

| Item | Finding |
|---|---|
| Production domain | `https://yourtribe.vercel.app` |
| Latest production commit | `cb5c626` — `Build YourTribe social media platform` |
| Deployment status | Ready |
| Vercel deployment URL | `https://yourtribe-3d5tqbc15-tyreese-burtons-projects.vercel.app` |
| Observed dashboard error rate | 53.8% at time of inspection |
| Current runtime-log query | Filtered to deployment `dpl_Bw7AjpdWRdn1QNP4bvwZ3CoRSQvp`; logs were still loading at the latest review. |

The project overview recommends connecting its Git repository, adding a custom domain, creating a Preview deployment, and enabling observability products. The project already displays `main` and the expected GitHub commit as its production source.

## Runtime-log finding

The Vercel runtime log confirms the observed production failure:

> `GET /api/auth/get-session` returned `500` because Better Auth reports: `You are using the default secret. Please set BETTER_AUTH_SECRET in your environment variables or pass secret in your auth config.`

The project settings list these server-side variables: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `STORAGE_UPLOAD_ENDPOINT`, and `AYRSHARE_API_KEY`. Their existence does not confirm that each one is scoped to **Production**, so the next verification is the `BETTER_AUTH_SECRET` environment target and post-change redeployment behavior.

## Environment scope verification

Vercel confirms that `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `STORAGE_UPLOAD_ENDPOINT`, and `AYRSHARE_API_KEY` are all marked **Sensitive** and targeted at **Production and Preview**. Because `BETTER_AUTH_SECRET` is present but the production runtime still reports the default secret, its current stored value is invalid for Better Auth and must be replaced with a newly generated strong secret, followed by a redeployment.

## Approved remediation

The user approved replacement of the invalid Better Auth secret for both Production and Preview. The Vercel secret management menu exposes a secure **Rotate** action, which will replace the value without revealing it in application logs or the repository. After rotation, a production redeployment is required to make the replacement effective.

The initial Vercel **Rotate** dialog requires a statement that the old value was revoked at an external issuing service. Because this is an internal Better Auth signing secret rather than an externally issued credential, that attestation would be inaccurate. The remediation will instead use the standard **Edit** workflow to replace the value, preserving correct audit semantics.

A newly generated, high-entropy Better Auth signing secret has been entered into the Vercel edit form. It is targeted to **Production and Preview** and is handled as a Vercel Sensitive Environment Variable; the secret value is not stored in this repository or its documentation.

The Vercel update completed successfully: `BETTER_AUTH_SECRET` now shows as updated for **Production and Preview**, and a new Production redeployment was initiated from the current `main` deployment to apply the corrected configuration.

## Redeployment monitoring

Vercel created a new Production deployment, **`AjZNVSD782zXC6z7AnmGZpuQMkNj`**, from commit `cb5c626`. At the latest check, it was still building and had reached the optimized production-build stage. Verification will continue once the deployment reports a terminal status.

The corrected production deployment completed successfully with status **Ready** after 1 minute 7 seconds. It is now the latest production deployment and is assigned to `https://yourtribe.vercel.app`.

## Post-deployment validation

The production Better Auth endpoint at `https://yourtribe.vercel.app/api/auth/get-session` now returns `null` for an anonymous visitor, which is the expected successful response when no session exists. It no longer returns the prior 500 default-secret error. The production landing page at `https://yourtribe.vercel.app` also renders successfully, including the Content Pyramid marketing experience and working navigation links.

## Email/password feature release

Commit `dfdd206` (`Add manager email password account flows`) was pushed to `main`. Vercel automatically started a new Production deployment for this commit; at the latest check it was still building.
The automatic email/password feature deployment was no longer shown as building on the project overview at the latest refresh, while the production summary still displayed the previous deployment. The deployment history will be inspected next to determine the new release’s final status.
The Vercel deployment history confirms the email/password feature release, commit `dfdd206`, completed successfully in **40 seconds** with status **Ready**. The production sign-in page now displays the email/password fields and the checked **Keep me signed in on this device** control.
