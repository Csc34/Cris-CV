import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projects } from "@/data/projects";

describe("ProjectGrid", () => {
  it("renders one card per project with a link to its detail page", () => {
    render(<ProjectGrid />);

    for (const item of projects) {
      const link = screen.getByRole("link", { name: new RegExp(item.title) });
      expect(link.getAttribute("href")).toMatch(new RegExp(`^/projects/${item.slug}/?$`));
      expect(within(link).getByText(item.description)).toBeInTheDocument();
    }
  });
});
