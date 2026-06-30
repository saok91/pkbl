"use client";

import { useRef } from "react";

import { EDITABLE_CHARSET, buildPaletteSections } from "@/lib/layout";

import { CharsetCharButton } from "./charset-char-button";
import { CharsetSectionGrid } from "./charset-section-grid";
import { useFocusTrap } from "./use-focus-trap";

type KeyCharPopoverProps = {
  onSelect: (char: string) => void;
  onClose: () => void;
  className?: string;
};

export function KeyCharPopover({
  onSelect,
  onClose,
  className = "",
}: KeyCharPopoverProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const sections = buildPaletteSections(EDITABLE_CHARSET);

  useFocusTrap(dialogRef, true, onClose);

  return (
    <div
      ref={dialogRef}
      dir="rtl"
      className={`border-border-strong bg-popover z-30 w-[min(22rem,calc(100vw-2rem))] rounded-xl border p-3 text-right shadow-2xl ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label="انتخاب کاراکتر"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-text-dim text-[10px]">انتخاب کاراکتر</span>
        <button
          type="button"
          onClick={onClose}
          className="text-text-faint hover:text-text-secondary transition-colors"
          aria-label="بستن"
        >
          ×
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <CharsetSectionGrid
          sections={sections}
          containerClassName="space-y-2"
          sectionTitleClassName="mb-1 text-[10px] font-medium text-text-faint"
          gridClassName="flex flex-wrap justify-start gap-1"
          renderChar={(char, sectionId) => (
            <CharsetCharButton
              key={`${sectionId}-${char}`}
              char={char}
              size="sm"
              onClick={() => onSelect(char)}
            />
          )}
        />
      </div>
    </div>
  );
}
