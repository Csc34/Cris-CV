interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div className="text-right">
      <p className="font-mono text-xs tracking-widest text-neutral-500">[ STATUS ]</p>
      <p className="mt-2 flex items-center justify-end gap-2 font-mono text-xs font-bold uppercase text-ink">
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
        {status}
      </p>
    </div>
  );
}
