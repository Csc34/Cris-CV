import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutCard } from "@/components/AboutCard";
import { profile } from "@/data/profile";

describe("AboutCard", () => {
  it("renders the headline and paragraph from profile data", () => {
    render(<AboutCard />);

    expect(screen.getByText(profile.aboutHeadline)).toBeInTheDocument();
    expect(screen.getByText(profile.aboutParagraph)).toBeInTheDocument();
  });
});
