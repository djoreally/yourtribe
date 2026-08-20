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
