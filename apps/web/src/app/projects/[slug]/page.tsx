import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { DetailPageShell } from "@/components/DetailPageShell";
import { ProjectPlaceholderImage } from "@/components/ProjectPlaceholderImage";

export function generateStaticParams() {
  return projects.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const item = projects.find((p) => p.slug === params.slug);
  return { title: item ? item.title : "Not found" };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const item = projects.find((p) => p.slug === params.slug);
  if (!item) notFound();

  return (
    <DetailPageShell eyebrow="PROJECT" title={item.title}>
      <ProjectPlaceholderImage icon={item.icon} />

      <div className="mt-6 space-y-4 text-neutral-600">
        {item.longDescription.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <h2 className="mt-8 font-mono text-xs tracking-widest text-neutral-500">[ TECH_STACK ]</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-pill px-3 py-1 font-mono text-xs text-neutral-600"
          >
            {tech}
          </span>
        ))}
      </div>

      {item.links && item.links.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-4">
          {item.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-ink hover:opacity-70"
            >
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ))}
        </div>
      ) : null}
    </DetailPageShell>
  );
}
