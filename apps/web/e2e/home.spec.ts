import { test, expect } from "@playwright/test";

test("home page renders all 6 sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText(/01_ABOUT_ME/)).toBeVisible();
  await expect(page.getByText(/02_EXPERIENCE/)).toBeVisible();
  await expect(page.getByText(/03_PROFESSIONAL_INTEREST/)).toBeVisible();
  await expect(page.getByText(/04_PROJECTS/)).toBeVisible();
  await expect(page.getByText(/05_CERTIFICATIONS/)).toBeVisible();
  await expect(page.getByText(/06_CONTACT/)).toBeVisible();
});
