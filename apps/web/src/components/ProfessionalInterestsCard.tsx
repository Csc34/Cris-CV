import { professionalInterests } from "@/data/professional-interests";

export function ProfessionalInterestsCard() {
  return (
    <div className="rounded-2xl bg-ink p-6 text-white shadow-sm md:p-8">
      <h2 className="text-xl font-bold md:text-2xl">{professionalInterests.title}</h2>
      <ul className="mt-4 space-y-3">
        {professionalInterests.items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500"
              aria-hidden="true"
            />
            <span className="text-neutral-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
