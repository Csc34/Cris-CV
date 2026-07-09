import { Github, Linkedin, Mail, type LucideIcon } from "lucide-react";
import { profile } from "@/data/profile";

interface ContactLink {
  label: string;
  href: string;
  display: string;
  icon: LucideIcon;
  external: boolean;
}

export function ContactCard() {
  const links: ContactLink[] = [
    {
      label: "GitHub",
      href: profile.githubUrl,
      display: profile.githubUrl.replace(/^https?:\/\//, ""),
      icon: Github,
      external: true,
    },
    {
      label: "LinkedIn",
      href: profile.linkedinUrl,
      display: profile.linkedinUrl.replace(/^https?:\/\//, ""),
      icon: Linkedin,
      external: true,
    },
    {
      label: "Email",
      href: `mailto:${profile.email}`,
      display: profile.email,
      icon: Mail,
      external: false,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {links.map(({ label, href, display, icon: Icon, external }) => (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition-opacity hover:opacity-70"
          >
            <Icon className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">{label}</p>
              <p className="truncate text-sm text-ink">{display}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
