import { expect, test } from "@playwright/test";

test("renders the Content Pyramid product landing page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Content Pyramid/);
  await expect(page.getByRole("heading", { name: "Your customers already create the story." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore the patron portal/i })).toBeVisible();
});

test("renders a tenant-branded app-less upload portal", async ({ page }) => {
  await page.goto("/portal/ambler-brewing");

  await expect(page.getByRole("heading", { name: "Ambler Brewing Co." })).toBeVisible();
  await expect(page.getByText(/Tap to record or upload/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Submit to community feed/i })).toBeVisible();
});

test("renders the email/password manager registration flow", async ({ page }) => {
  await page.goto("/sign-up");

  await expect(page.getByRole("heading", { name: "Start your workspace." })).toBeVisible();
  await expect(page.getByLabel("Business or workspace name")).toBeVisible();
  await expect(page.getByLabel("Create a password")).toBeVisible();
  await expect(page.getByLabel("Confirm password")).toBeVisible();
  await expect(page.getByRole("button", { name: /Create account/i })).toBeVisible();
});

test("renders persistent email/password sign-in controls", async ({ page }) => {
  await page.goto("/sign-in?callbackUrl=/dashboard");

  await expect(page.getByRole("heading", { name: "Welcome back." })).toBeVisible();
  await expect(page.getByLabel("Keep me signed in on this device")).toBeChecked();
  await expect(page.getByRole("button", { name: /^Sign in/i })).toBeVisible();
});
