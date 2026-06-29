"use client";

import { useDraggable } from "@dnd-kit/core";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  EDITABLE_CHARSET,
  buildPaletteSections,
  type PaletteSection,
} from "@/lib/layout";
import type { Layout } from "@/lib/layout/types";

import { CharsetCharButton } from "./charset-char-button";
import { DRAG_ID } from "./constants";
import {
  getAssignedCharSets,
  getPaletteCharAssignment,
  type PaletteCharAssignment,
} from "./palette-char-state";
import {
  computePaletteColumnCounts,
  computePaletteTargetRows,
  computePaletteUnitSize,
  computeSectionGridWidth,
  paletteCustomLabelFontSize,
} from "./palette-grid";

const PALETTE_SECTION_GAP_PX = 12;

/** Visual states for palette character buttons (and legend swatches). */
export const PALETTE_CHAR_STYLES = {
  free: "border-rose-400/90 bg-rose-950/80 font-medium text-rose-50 shadow-sm ring-1 ring-rose-500/20 hover:border-rose-300 hover:bg-rose-900/90 hover:text-white",
  base: "border-slate-500 bg-slate-900 text-slate-200 hover:border-slate-400 hover:bg-slate-800/90",
  shift:
    "border-violet-600/55 bg-violet-950/35 text-violet-200/90 hover:border-violet-500/65 hover:bg-violet-950/50 hover:text-violet-100",
  pending: "border-sky-400 bg-sky-900 text-white ring-2 ring-sky-500/50",
} as const;

export const PALETTE_LEGEND_SWATCHES = {
  free: "border border-rose-400/90 bg-rose-950/80 ring-1 ring-rose-500/20",
  base: "border border-slate-500 bg-slate-900",
  shift: "border border-violet-600/55 bg-violet-950/35",
} as const;

export const PALETTE_LEGEND_LABELS = {
  free: "آزاد",
  base: "پایه",
  shift: "شیفت",
} as const;

type CharacterPaletteProps = {
  layout: Layout;
  pendingChar: string | null;
  selectedKeyId: string | null;
  onCharClick: (char: string) => void;
};

type PaletteLayoutMetrics = {
  unitPx: number;
  gapPx: number;
  targetRows: number;
  columnCounts: readonly number[];
};

function PaletteChar({
  char,
  unitPx,
  assignment,
  isPending,
  onClick,
}: {
  char: string;
  unitPx: number;
  assignment: PaletteCharAssignment;
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
      unitPx={unitPx}
      buttonRef={setNodeRef}
      dragProps={{
        ...listeners,
        ...attributes,
        "aria-pressed": isPending,
      }}
      className={`${
        isPending
          ? PALETTE_CHAR_STYLES.pending
          : PALETTE_CHAR_STYLES[assignment]
      } ${isDragging ? "pointer-events-none invisible" : ""}`}
    />
  );
}

function PaletteSectionColumn({
  section,
  columnCount,
  targetRows,
  unitPx,
  gapPx,
  renderChar,
}: {
  section: PaletteSection;
  columnCount: number;
  targetRows: number;
  unitPx: number;
  gapPx: number;
  renderChar: (char: string, sectionId: string) => ReactNode;
}) {
  const gridStyle: CSSProperties = {
    gridTemplateRows: `repeat(${targetRows}, ${unitPx}px)`,
    gridAutoFlow: "column",
    gridAutoColumns: `${unitPx}px`,
    gap: `${gapPx}px`,
    width: computeSectionGridWidth(columnCount, unitPx, gapPx),
  };

  return (
    <div className="flex shrink-0 flex-col gap-1">
      <h3
        className="text-center font-medium text-slate-400"
        style={{ fontSize: paletteCustomLabelFontSize(unitPx + 8) }}
      >
        {section.label}
      </h3>
      <div className="grid" style={gridStyle}>
        {[...section.chars].map((char) => renderChar(char, section.id))}
      </div>
    </div>
  );
}

export function CharacterPalette({
  layout,
  pendingChar,
  selectedKeyId,
  onCharClick,
}: CharacterPaletteProps) {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [layoutMetrics, setLayoutMetrics] =
    useState<PaletteLayoutMetrics | null>(null);

  const assignedSets = useMemo(() => getAssignedCharSets(layout), [layout]);

  const sections = useMemo(() => buildPaletteSections(EDITABLE_CHARSET), []);

  const sectionCharCounts = useMemo(
    () => sections.map((section) => section.chars.length),
    [sections],
  );

  const targetRows = useMemo(
    () => computePaletteTargetRows(sectionCharCounts),
    [sectionCharCounts],
  );

  const columnCounts = useMemo(
    () => computePaletteColumnCounts(sectionCharCounts, targetRows),
    [sectionCharCounts, targetRows],
  );

  const defaultMetrics = useMemo(
    () => ({
      ...computePaletteUnitSize(columnCounts, 920, {
        sectionGapPx: PALETTE_SECTION_GAP_PX,
      }),
      targetRows,
      columnCounts,
    }),
    [columnCounts, targetRows],
  );

  useLayoutEffect(() => {
    const container = sectionsRef.current;
    if (!container) {
      return;
    }

    const updateLayout = () => {
      const availableWidth = container.clientWidth;
      if (availableWidth <= 0) {
        return;
      }
      const { unitPx, gapPx } = computePaletteUnitSize(
        columnCounts,
        availableWidth,
        { sectionGapPx: PALETTE_SECTION_GAP_PX },
      );
      setLayoutMetrics({ unitPx, gapPx, targetRows, columnCounts });
    };

    updateLayout();

    const observer = new ResizeObserver(updateLayout);
    observer.observe(container);
    return () => observer.disconnect();
  }, [columnCounts, targetRows]);

  const unitPx = layoutMetrics?.unitPx ?? defaultMetrics.unitPx;
  const gapPx = layoutMetrics?.gapPx ?? defaultMetrics.gapPx;

  const renderChar = (char: string, sectionId: string): ReactNode => (
    <PaletteChar
      key={`${sectionId}-${char}`}
      char={char}
      unitPx={unitPx}
      assignment={getPaletteCharAssignment(
        char,
        assignedSets.base,
        assignedSets.shift,
      )}
      isPending={pendingChar === char}
      onClick={() => onCharClick(char)}
    />
  );

  return (
    <section
      dir="rtl"
      className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-right"
      aria-label="پالت کاراکترها"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 className="text-sm font-semibold text-slate-200">
          کاراکترهای Persian Standard
        </h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span
              className={`inline-block h-3.5 w-3.5 rounded-md shadow-sm ${PALETTE_LEGEND_SWATCHES.free}`}
            />
            {PALETTE_LEGEND_LABELS.free}
          </span>
          <span className="flex items-center gap-1">
            <span
              className={`inline-block h-3.5 w-3.5 rounded-md ${PALETTE_LEGEND_SWATCHES.base}`}
            />
            {PALETTE_LEGEND_LABELS.base}
          </span>
          <span className="flex items-center gap-1">
            <span
              className={`inline-block h-3.5 w-3.5 rounded-md ${PALETTE_LEGEND_SWATCHES.shift}`}
            />
            {PALETTE_LEGEND_LABELS.shift}
          </span>
          {selectedKeyId ? (
            <span className="text-slate-400">· کلیک یا drag</span>
          ) : null}
        </div>
      </div>

      <div
        ref={sectionsRef}
        className="flex flex-nowrap items-start justify-center"
        style={{ gap: `${PALETTE_SECTION_GAP_PX}px` }}
      >
        {sections.map((section, index) => (
          <PaletteSectionColumn
            key={section.id}
            section={section}
            columnCount={columnCounts[index] ?? 1}
            targetRows={targetRows}
            unitPx={unitPx}
            gapPx={gapPx}
            renderChar={renderChar}
          />
        ))}
      </div>
    </section>
  );
}
