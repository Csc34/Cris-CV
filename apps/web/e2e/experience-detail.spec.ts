import { test, expect } from "@playwright/test";

test("clicking the first experience row navigates to its detail page", async ({ page }) => {
  await page.goto("/");

  const firstRow = page.locator('a[href^="/experience/"]').first();
  const href = await firstRow.getAttribute("href");
  await firstRow.click();

  await expect(page).toHaveURL(new RegExp(href!.replace(/\//g, "\\/")));
  await expect(page.getByText(/ACHIEVEMENTS/)).toBeVisible();
  // TECH_STACK is only rendered when the entry has a non-empty techStack array,
  // so it isn't asserted here unconditionally.
});
