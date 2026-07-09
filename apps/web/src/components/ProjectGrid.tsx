import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {projects.map((item) => (
        <ProjectCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
