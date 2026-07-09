import { experience } from "@/data/experience";
import { ExperienceRow } from "./ExperienceRow";

export function ExperienceList() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <div className="divide-y divide-neutral-200">
        {experience.map((item) => (
          <ExperienceRow key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
