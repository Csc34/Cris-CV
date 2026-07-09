import Link from "next/link";
import type { ExperienceItem } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

export function ExperienceRow({ item }: { item: ExperienceItem }) {
  return (
    <Link
      href={`/experience/${item.slug}/`}
      className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 transition-opacity hover:opacity-70"
    >
      <div>
        <p className="font-semibold text-ink">{item.title}</p>
        <p className="text-sm text-neutral-500">{item.company}</p>
      </div>
      <span className="whitespace-nowrap rounded-full bg-pill px-3 py-1 font-mono text-xs text-neutral-600">
        {formatDateRange(item.startDate, item.endDate)}
      </span>
    </Link>
  );
}
