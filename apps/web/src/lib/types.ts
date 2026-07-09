export interface Profile {
  tag: string;
  name: string;
  role: string;
  status: string;
  aboutHeadline: string;
  aboutParagraph: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
}

export interface ExperienceItem {
  slug: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | "Present";
  summary: string;
  description: string[];
  achievements: string[];
  techStack: string[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export type ProjectIcon = "layers" | "cube" | "box";

export interface ProjectItem {
  slug: string;
  title: string;
  description: string;
  longDescription: string[];
  techStack: string[];
  links?: ProjectLink[];
  icon: ProjectIcon;
}

export interface ProfessionalInterests {
  title: string;
  items: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}
