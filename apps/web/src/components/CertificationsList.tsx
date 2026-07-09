import { certifications } from "@/data/certifications";

export function CertificationsList() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <div className="divide-y divide-neutral-200">
        {certifications.map((cert) => (
          <div
            key={cert.name}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div>
              <p className="font-semibold text-ink">{cert.name}</p>
              <p className="text-sm text-neutral-500">{cert.issuer}</p>
            </div>
            <span className="whitespace-nowrap rounded-full bg-pill px-3 py-1 font-mono text-xs text-neutral-600">
              {cert.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
