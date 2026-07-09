import { test, expect } from "@playwright/test";

test("unknown experience slug renders the 404 page", async ({ page }) => {
  const response = await page.goto("/experience/does-not-exist/");

  expect(response?.status()).toBe(404);
  await expect(page.getByText(/404_NOT_FOUND/)).toBeVisible();
});

test("unknown project slug renders the 404 page", async ({ page }) => {
  const response = await page.goto("/projects/does-not-exist/");

  expect(response?.status()).toBe(404);
  await expect(page.getByText(/404_NOT_FOUND/)).toBeVisible();
});
