import { profile } from "@/data/profile";
import { Divider } from "./Divider";
import { StatusBadge } from "./StatusBadge";

export function Header() {
  const nameLines = profile.name.split(" ");

  return (
    <header>
      <div className="flex items-start justify-between gap-6">
        <p className="font-mono text-xs tracking-widest text-neutral-500">[ {profile.tag} ]</p>
        <StatusBadge status={profile.status} />
      </div>

      <h1 className="mt-4 font-display text-5xl font-black leading-[0.95] tracking-tight text-ink md:text-7xl">
        {nameLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <p className="mt-3 font-mono text-sm uppercase tracking-wide text-neutral-500">
        {profile.role}
      </p>

      <Divider className="mt-8" />
    </header>
  );
}
