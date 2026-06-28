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
      className={`z-30 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-slate-600 bg-slate-800 p-3 text-right shadow-xl ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label="انتخاب کاراکتر"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-200">
          انتخاب کاراکتر
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-slate-700 hover:text-white"
        >
          بستن
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <CharsetSectionGrid
          sections={sections}
          containerClassName="space-y-2"
          sectionTitleClassName="mb-1 text-[10px] font-medium text-slate-500"
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
