import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ExperienceList } from "@/components/ExperienceList";
import { experience } from "@/data/experience";

describe("ExperienceList", () => {
  it("renders one row per experience entry with a link to its detail page", () => {
    render(<ExperienceList />);
    const links = screen.getAllByRole("link");

    for (const item of experience) {
      const link = links.find((el) =>
        new RegExp(`^/experience/${item.slug}/?$`).test(el.getAttribute("href") ?? ""),
      );
      expect(link).toBeDefined();
      expect(within(link as HTMLElement).getByText(item.title)).toBeInTheDocument();
      expect(within(link as HTMLElement).getByText(item.company)).toBeInTheDocument();
    }
  });
});
