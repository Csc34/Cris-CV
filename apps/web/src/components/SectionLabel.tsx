interface SectionLabelProps {
  index: number;
  label: string;
}

export function SectionLabel({ index, label }: SectionLabelProps) {
  const paddedIndex = String(index).padStart(2, "0");
  return (
    <p className="mb-4 font-mono text-xs tracking-widest text-neutral-500">
      [ {paddedIndex}_{label} ]
    </p>
  );
}
