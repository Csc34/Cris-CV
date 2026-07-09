import type { ProjectItem } from "@/lib/types";

// PLACEHOLDER CONTENT — replace with your real projects.
export const projects: ProjectItem[] = [
  {
    slug: "project-one",
    title: "Project One",
    description: "One or two sentences describing project one, shown on the home page card.",
    longDescription: [
      "Replace with a full description of the project: the problem it solves, how it works, and your role in building it.",
    ],
    techStack: ["Next.js", "AWS CDK", "TypeScript"],
    links: [{ label: "View source", href: "https://github.com/your-username/project-one" }],
    icon: "layers",
  },
  {
    slug: "project-two",
    title: "Project Two",
    description: "One or two sentences describing project two, shown on the home page card.",
    longDescription: [
      "Replace with a full description of the project: the problem it solves, how it works, and your role in building it.",
    ],
    techStack: ["Python", "Terraform"],
    links: [{ label: "View source", href: "https://github.com/your-username/project-two" }],
    icon: "box",
  },
];
