"use client";

import { useDraggable } from "@dnd-kit/core";
import { useMemo } from "react";

import {
  EDITABLE_CHARSET,
  buildPaletteSections,
  getAssignedCharsForLayer,
} from "@/lib/layout";
import type { Layer, Layout } from "@/lib/layout/types";

import { CharsetCharButton } from "./charset-char-button";
import { CharsetSectionGrid } from "./charset-section-grid";
import { DRAG_ID } from "./constants";

type CharacterPaletteProps = {
  layout: Layout;
  activeLayer: Layer;
  pendingChar: string | null;
  selectedKeyId: string | null;
  onCharClick: (char: string) => void;
};

function PaletteChar({
  char,
  isAssigned,
  isPending,
  onClick,
}: {
  char: string;
  isAssigned: boolean;
  isPending: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: DRAG_ID.char(char),
    data: { type: "char", char },
  });

  return (
    <CharsetCharButton
      char={char}
      onClick={onClick}
      buttonRef={setNodeRef}
      dragProps={{
        ...listeners,
        ...attributes,
        "aria-pressed": isPending,
      }}
      className={`${
        isPending
          ? "border-sky-400 bg-sky-900 text-white ring-2 ring-sky-500/50"
          : isAssigned
            ? "border-slate-600 bg-slate-800 text-slate-400"
            : "border-slate-500 bg-slate-900 text-slate-100 hover:border-sky-500 hover:bg-sky-950"
      } ${isDragging ? "pointer-events-none invisible" : ""}`}
      size="md"
    />
  );
}

export function CharacterPalette({
  layout,
  activeLayer,
  pendingChar,
  selectedKeyId,
  onCharClick,
}: CharacterPaletteProps) {
  const assignedSet = useMemo(
    () => new Set(getAssignedCharsForLayer(layout, activeLayer)),
    [activeLayer, layout],
  );

  const sections = useMemo(
    () => buildPaletteSections(EDITABLE_CHARSET),
    [],
  );

  return (
    <section
      dir="rtl"
      className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-right"
      aria-label="پالت کاراکترها"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-200">
          کاراکترهای Persian Standard
        </h2>
        <span className="text-xs text-slate-400">
          {selectedKeyId
            ? "روی کاراکتر کلیک کنید یا بکشید"
            : "کلید را انتخاب کنید یا بکشید"}
        </span>
      </div>
      <div className="mb-4 flex flex-wrap justify-start gap-x-4 gap-y-1 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded border border-slate-500 bg-slate-900" />
          آزاد
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded border border-slate-600 bg-slate-800" />
          اختصاص‌یافته
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded border border-sky-400 bg-sky-900 ring-1 ring-sky-500/50" />
          انتخاب‌شده
        </span>
      </div>
      <CharsetSectionGrid
        sections={sections}
        gridClassName="flex flex-wrap justify-start gap-1.5"
        renderChar={(char, sectionId) => (
          <PaletteChar
            key={`${sectionId}-${char}`}
            char={char}
            isAssigned={assignedSet.has(char)}
            isPending={pendingChar === char}
            onClick={() => onCharClick(char)}
          />
        )}
      />
    </section>
  );
}
