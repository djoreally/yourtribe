# Vercel Preview Environments and GitHub Actions CI/CD

The repository now uses GitHub Actions as the deployment gate. The workflow runs linting, TypeScript validation, Prisma client generation, and Playwright smoke tests before it deploys a Preview or Production artifact. The `vercel.json` configuration disables Vercel’s native Git auto-deployments, preventing a second deployment from starting before the checks complete. [1]

## One-Time Vercel Setup

After creating the dedicated **YourTribe** Vercel project, open its **Settings → Environment Variables** page and add the shared Preview variables listed below. Use the **Preview** target, not Production, for these values. Vercel applies a branch-specific Preview value in preference to the shared Preview value when both exist. [2]

| Variable | Shared Preview value | Branch-specific use |
|---|---|---|
| `DATABASE_URL` | A non-production Neon connection string. | Recommended. Point `staging` or a feature branch to its own Neon branch when database changes or destructive test data are involved. |
| `BETTER_AUTH_SECRET` | A distinct non-production secret. | Optional; use a distinct value for isolated QA environments. |
| `BETTER_AUTH_URL` | A stable Preview URL only if you assign one. | Recommended only for a branch with a stable alias or custom domain, such as `staging`. |
| `AYRSHARE_API_KEY` | Omit unless Preview must test real publishing. | Avoid by default; use a non-production profile key if available. |
| `STORAGE_UPLOAD_ENDPOINT` | A Preview-only signing endpoint or test storage resource. | Use a branch-specific bucket or prefix for destructive upload tests. |

> Never point a Preview deployment at the Production database, production storage, or production social-distribution credentials. The Content Pyramid Better Auth configuration also recognizes Vercel’s deployment URL as a trusted browser origin, allowing Preview sign-in requests without exposing secrets to client code.

### Add a Branch-Specific Preview Variable in the Dashboard

Open **Settings → Environment Variables**, select the variable, choose **Preview**, and select the specific Git branch—for example, `staging`. Save the value, then create a new deployment. Vercel scopes that value to only the selected branch; it overrides the general Preview value for that branch. [2]

### Add a Branch-Specific Preview Variable with the Vercel CLI

The commands below are a safe template. Create the secret file locally with restrictive permissions, run the command from the repository root, then securely remove the local file. Do not place real credentials in a committed shell script.

```bash
# Link the repository once; it creates an ignored .vercel directory.
vercel link

# Add DATABASE_URL for the staging branch without echoing its value in shell history.
chmod 600 ./staging-database-url.txt
vercel env add DATABASE_URL preview staging < ./staging-database-url.txt
rm ./staging-database-url.txt

# Confirm the target is scoped to the staging branch. Values remain hidden.
vercel env ls preview staging
```

When GitHub Actions runs, it pulls the Preview configuration for the current branch through:

```bash
vercel pull --yes --environment=preview --git-branch="$PREVIEW_BRANCH"
```

This is why branch-scoped values are available to the Vercel build without being copied into GitHub repository secrets. [3]

## One-Time GitHub Setup

Open **GitHub → Settings → Secrets and variables → Actions** for `djoreally/yourtribe` and create the following **repository secrets**. Keep the values private; the workflow exposes none of them in logs.

| GitHub secret | Source |
|---|---|
| `VERCEL_TOKEN` | A scoped Vercel access token with permission to deploy the selected project. |
| `VERCEL_ORG_ID` | The Vercel team or account ID from `.vercel/project.json` after `vercel link`. |
| `VERCEL_PROJECT_ID` | The Vercel project ID from `.vercel/project.json` after `vercel link`. |

The Vercel CLI deployment pattern requires those three secrets. They authenticate the workflow and link it to the intended project without committing credentials. [4]

In **GitHub → Settings → Environments**, create `preview` and `production`. Add a required reviewer to the `production` environment if human approval is required before the final deployment job runs. The workflow already targets these names.

## CI/CD Behavior

| Event | Validation | Deployment result |
|---|---|---|
| Pull request to `main` | Lint, type check, Prisma generation, and browser smoke tests run. | A Preview deploy runs only for same-repository pull requests, protecting secrets from forked pull requests. |
| Push to a non-`main` branch | The same validation suite runs first. | On success, the workflow pulls that branch’s Preview variables, builds once, and deploys a Vercel Preview artifact. |
| Push to `main` | The same validation suite runs first. | On success, the workflow pulls Production variables and deploys the prebuilt artifact with `--prod`. |

The workflow uses `vercel build` followed by `vercel deploy --prebuilt` so Vercel does not rebuild the artifact a second time. [4]

## Required Repository and Vercel Settings

GitHub Actions must be allowed to write deployment metadata only if you later add a pull-request comment step; the current workflow needs only read access to repository contents. Vercel’s native Git integration should remain disabled because `.github/workflows/ci-vercel.yml` is the authoritative deploy path. The committed `vercel.json` already sets `git.deploymentEnabled` to `false`. [1]

For branch-specific Preview aliases or predictable Better Auth callback origins, create a Vercel Custom Environment such as `staging`, associate it with the `staging` branch, and attach a stable domain. Custom Environments are available on Vercel Pro and Enterprise plans. [5]

## References

[1] [Vercel — Git Configuration](https://vercel.com/docs/project-configuration/git-configuration)

[2] [Vercel — Environment Variables](https://vercel.com/docs/environment-variables)

[3] [Vercel CLI — `vercel pull`](https://vercel.com/docs/cli/pull)

[4] [Vercel — GitHub Actions with Vercel](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel)

[5] [Vercel — Environments](https://vercel.com/docs/deployments/environments)
