import { notFound } from "next/navigation";
import { experience } from "@/data/experience";
import { DetailPageShell } from "@/components/DetailPageShell";
import { formatDateRange } from "@/lib/utils";

export function generateStaticParams() {
  return experience.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const item = experience.find((e) => e.slug === params.slug);
  return { title: item ? `${item.title} — ${item.company}` : "Not found" };
}

export default function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  const item = experience.find((e) => e.slug === params.slug);
  if (!item) notFound();

  return (
    <DetailPageShell
      eyebrow="EXPERIENCE"
      title={item.title}
      subtitle={item.company}
      meta={
        <span className="mt-3 inline-block rounded-full bg-pill px-3 py-1 font-mono text-xs text-neutral-600">
          {formatDateRange(item.startDate, item.endDate)}
        </span>
      }
    >
      <div className="space-y-4 text-neutral-600">
        {item.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <h2 className="mt-8 font-mono text-xs tracking-widest text-neutral-500">[ ACHIEVEMENTS ]</h2>
      <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-600">
        {item.achievements.map((achievement) => (
          <li key={achievement}>{achievement}</li>
        ))}
      </ul>

      {item.techStack.length > 0 ? (
        <>
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
        </>
      ) : null}
    </DetailPageShell>
  );
}
