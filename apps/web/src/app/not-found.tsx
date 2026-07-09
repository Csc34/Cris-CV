import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center px-6">
      <p className="font-mono text-xs tracking-widest text-neutral-500">[ 404_NOT_FOUND ]</p>
      <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-ink md:text-6xl">
        Page not found.
      </h1>
      <p className="mt-4 text-neutral-600">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 font-mono text-xs font-bold tracking-widest text-ink hover:opacity-70"
      >
        [ ← BACK_HOME ]
      </Link>
    </main>
  );
}
