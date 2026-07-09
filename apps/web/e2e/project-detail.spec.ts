import { test, expect } from "@playwright/test";

test("clicking a project card navigates to its detail page", async ({ page }) => {
  await page.goto("/");

  const firstCard = page.locator('a[href^="/projects/"]').first();
  const href = await firstCard.getAttribute("href");
  await firstCard.click();

  await expect(page).toHaveURL(new RegExp(href!.replace(/\//g, "\\/")));
  await expect(page.getByText(/TECH_STACK/)).toBeVisible();
});
