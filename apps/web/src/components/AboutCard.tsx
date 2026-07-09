import { profile } from "@/data/profile";

export function AboutCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-xl font-bold text-ink md:text-2xl">{profile.aboutHeadline}</h2>
      <p className="mt-4 max-w-2xl text-neutral-600">{profile.aboutParagraph}</p>
    </div>
  );
}
