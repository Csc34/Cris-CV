import Link from "next/link";
import type { ProjectItem } from "@/lib/types";
import { ProjectPlaceholderImage } from "./ProjectPlaceholderImage";

export function ProjectCard({ item }: { item: ProjectItem }) {
  return (
    <Link
      href={`/projects/${item.slug}/`}
      className="rounded-2xl bg-white p-6 shadow-sm transition-opacity hover:opacity-80 md:p-8"
    >
      <h3 className="text-lg font-bold text-ink">{item.title}</h3>
      <p className="mt-2 text-neutral-600">{item.description}</p>
      <div className="mt-4">
        <ProjectPlaceholderImage icon={item.icon} />
      </div>
    </Link>
  );
}
