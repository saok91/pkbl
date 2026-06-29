"use client";

import type { ReactNode } from "react";

import type { PaletteSection } from "@/lib/layout";

type CharsetSectionGridProps = {
  sections: PaletteSection[];
  renderChar: (char: string, sectionId: string) => ReactNode;
  layout?: "stack" | "inline";
  sectionTitleClassName?: string;
  gridClassName?: string;
  containerClassName?: string;
  sectionClassName?: string;
};

export function CharsetSectionGrid({
  sections,
  renderChar,
  layout = "stack",
  sectionTitleClassName = "mb-1.5 text-xs font-medium text-slate-400",
  gridClassName = "flex flex-wrap gap-1.5",
  containerClassName = "space-y-3",
  sectionClassName,
}: CharsetSectionGridProps) {
  const inlineTitleClassName =
    sectionTitleClassName === "mb-1.5 text-xs font-medium text-slate-400"
      ? "w-[4.25rem] shrink-0 pt-0.5 text-[10px] leading-tight font-medium text-slate-500"
      : sectionTitleClassName;

  return (
    <div className={containerClassName}>
      {sections.map((section) =>
        layout === "inline" ? (
          <div
            key={section.id}
            className={`flex min-w-0 items-start gap-1.5 ${sectionClassName ?? ""}`}
          >
            <h3 className={inlineTitleClassName}>{section.label}</h3>
            <div className={`min-w-0 flex-1 ${gridClassName}`}>
              {[...section.chars].map((char) => renderChar(char, section.id))}
            </div>
          </div>
        ) : (
          <div key={section.id} className={sectionClassName}>
            <h3 className={sectionTitleClassName}>{section.label}</h3>
            <div className={gridClassName}>
              {[...section.chars].map((char) => renderChar(char, section.id))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
