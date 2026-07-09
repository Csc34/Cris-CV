import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CertificationsList } from "@/components/CertificationsList";
import { certifications } from "@/data/certifications";

describe("CertificationsList", () => {
  it("renders one row per certification with issuer and year", () => {
    render(<CertificationsList />);

    for (const cert of certifications) {
      expect(screen.getByText(cert.name)).toBeInTheDocument();
      expect(screen.getByText(cert.issuer)).toBeInTheDocument();
      expect(screen.getByText(cert.year)).toBeInTheDocument();
    }
  });
});
