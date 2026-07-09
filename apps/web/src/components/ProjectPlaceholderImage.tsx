import { Box, Boxes, Layers, type LucideIcon } from "lucide-react";
import type { ProjectIcon } from "@/lib/types";

const iconMap: Record<ProjectIcon, LucideIcon> = {
  layers: Layers,
  cube: Boxes,
  box: Box,
};

export function ProjectPlaceholderImage({ icon }: { icon: ProjectIcon }) {
  const Icon = iconMap[icon];
  return (
    <div className="flex aspect-video items-center justify-center rounded-xl bg-neutral-100">
      <Icon className="h-10 w-10 text-neutral-400" aria-hidden="true" />
    </div>
  );
}
