"use client";

import type { ReactNode } from "react";

import type { PaletteSection } from "@/lib/layout";

type CharsetSectionGridProps = {
  sections: PaletteSection[];
  renderChar: (char: string, sectionId: string) => ReactNode;
  sectionTitleClassName?: string;
  gridClassName?: string;
  containerClassName?: string;
};

export function CharsetSectionGrid({
  sections,
  renderChar,
  sectionTitleClassName = "mb-1.5 text-xs font-medium text-slate-400",
  gridClassName = "flex flex-wrap gap-1.5",
  containerClassName = "space-y-3",
}: CharsetSectionGridProps) {
  return (
    <div className={containerClassName}>
      {sections.map((section) => (
        <div key={section.id}>
          <h3 className={sectionTitleClassName}>{section.label}</h3>
          <div className={gridClassName}>
            {[...section.chars].map((char) => renderChar(char, section.id))}
          </div>
        </div>
      ))}
    </div>
  );
}
