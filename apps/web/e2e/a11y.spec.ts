import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { experience } from "../src/data/experience";
import { projects } from "../src/data/projects";

test("home page has no serious/critical accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(serious).toEqual([]);
});

test("experience detail page has no serious/critical accessibility violations", async ({ page }) => {
  await page.goto(`/experience/${experience[0].slug}/`);
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(serious).toEqual([]);
});

test("project detail page has no serious/critical accessibility violations", async ({ page }) => {
  await page.goto(`/projects/${projects[0].slug}/`);
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(serious).toEqual([]);
});
