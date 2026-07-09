import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactCard } from "@/components/ContactCard";
import { profile } from "@/data/profile";

describe("ContactCard", () => {
  it("links to GitHub, LinkedIn and email from profile data", () => {
    render(<ContactCard />);

    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", profile.githubUrl);
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      profile.linkedinUrl,
    );
    expect(screen.getByRole("link", { name: /Email/ })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
  });
});
