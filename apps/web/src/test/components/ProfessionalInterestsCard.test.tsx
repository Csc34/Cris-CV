import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfessionalInterestsCard } from "@/components/ProfessionalInterestsCard";
import { professionalInterests } from "@/data/professional-interests";

describe("ProfessionalInterestsCard", () => {
  it("renders the title and every interest item", () => {
    render(<ProfessionalInterestsCard />);

    expect(screen.getByText(professionalInterests.title)).toBeInTheDocument();
    for (const item of professionalInterests.items) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("renders the same number of list items as data", () => {
    render(<ProfessionalInterestsCard />);
    expect(screen.getAllByRole("listitem")).toHaveLength(professionalInterests.items.length);
  });
});
