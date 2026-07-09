import { Header } from "@/components/Header";
import { SectionLabel } from "@/components/SectionLabel";
import { AboutCard } from "@/components/AboutCard";
import { ExperienceList } from "@/components/ExperienceList";
import { ProfessionalInterestsCard } from "@/components/ProfessionalInterestsCard";
import { ProjectGrid } from "@/components/ProjectGrid";
import { CertificationsList } from "@/components/CertificationsList";
import { ContactCard } from "@/components/ContactCard";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <Header />

      <section className="mt-12">
        <SectionLabel index={1} label="ABOUT_ME" />
        <AboutCard />
      </section>

      <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
        <div>
          <SectionLabel index={2} label="EXPERIENCE" />
          <ExperienceList />
        </div>
        <div>
          <SectionLabel index={3} label="PROFESSIONAL_INTEREST" />
          <ProfessionalInterestsCard />
        </div>
      </section>

      <section className="mt-12">
        <SectionLabel index={4} label="PROJECTS" />
        <ProjectGrid />
      </section>

      <section className="mt-12">
        <SectionLabel index={5} label="CERTIFICATIONS" />
        <CertificationsList />
      </section>

      <section className="mt-12 pb-12">
        <SectionLabel index={6} label="CONTACT" />
        <ContactCard />
      </section>
    </main>
  );
}
