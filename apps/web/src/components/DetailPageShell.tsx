import type { ReactNode } from "react";
import Link from "next/link";
import { Divider } from "./Divider";

interface DetailPageShellProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  children: ReactNode;
}

export function DetailPageShell({ eyebrow, title, subtitle, meta, children }: DetailPageShellProps) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12 md:py-20">
      <Link
        href="/"
        className="font-mono text-xs tracking-widest text-neutral-500 transition-opacity hover:opacity-70"
      >
        [ ← BACK ]
      </Link>

      <p className="mt-8 font-mono text-xs tracking-widest text-neutral-500">[ {eyebrow} ]</p>
      <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight text-ink md:text-5xl">
        {title}
      </h1>
      {subtitle ? <p className="mt-2 text-neutral-500">{subtitle}</p> : null}
      {meta}

      <Divider className="mt-8" />

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-8">{children}</div>
    </main>
  );
}
