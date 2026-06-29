import { KEY_GAP_PX, KEY_UNIT_PX } from "./constants";

/**
 * Column count for a palette section so row count stays near `targetRows`.
 */
export function computePaletteColumnCount(
  charCount: number,
  targetRows: number,
): number {
  if (charCount <= 0 || targetRows <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(charCount / targetRows));
}

/**
 * Shared row target so every palette section ends up with similar height.
 * Uses √(largest section) — largest section gets roughly a square grid.
 */
export function computePaletteTargetRows(
  sectionCharCounts: readonly number[],
): number {
  const maxCount = sectionCharCounts.reduce(
    (max, count) => Math.max(max, count),
    0,
  );
  if (maxCount <= 0) {
    return 1;
  }
  return Math.ceil(Math.sqrt(maxCount));
}

export function computeSectionGridWidth(
  columnCount: number,
  unitPx: number,
  gapPx: number,
): number {
  if (columnCount <= 0) {
    return 0;
  }
  return columnCount * unitPx + Math.max(0, columnCount - 1) * gapPx;
}

export function computePaletteTotalWidth(
  columnCounts: readonly number[],
  unitPx: number,
  gapPx: number,
  sectionGapPx: number,
): number {
  const sectionsWidth = columnCounts.reduce(
    (sum, columns) => sum + computeSectionGridWidth(columns, unitPx, gapPx),
    0,
  );
  const sectionGaps = Math.max(0, columnCounts.length - 1) * sectionGapPx;
  return sectionsWidth + sectionGaps;
}

export type PaletteUnitSizeOptions = {
  readonly maxUnitPx?: number;
  readonly minUnitPx?: number;
  readonly gapPx?: number;
  readonly sectionGapPx?: number;
};

const DEFAULT_PALETTE_UNIT_OPTIONS: Required<PaletteUnitSizeOptions> = {
  maxUnitPx: KEY_UNIT_PX,
  minUnitPx: 34,
  gapPx: KEY_GAP_PX,
  sectionGapPx: 12,
};

/**
 * Scale palette key size down so all sections fit on one row.
 */
export function computePaletteUnitSize(
  columnCounts: readonly number[],
  availableWidth: number,
  options: PaletteUnitSizeOptions = {},
): { unitPx: number; gapPx: number } {
  const {
    maxUnitPx,
    minUnitPx,
    gapPx: baseGapPx,
    sectionGapPx,
  } = { ...DEFAULT_PALETTE_UNIT_OPTIONS, ...options };

  if (columnCounts.length === 0 || availableWidth <= 0) {
    return { unitPx: maxUnitPx, gapPx: baseGapPx };
  }

  const totalAtMax = computePaletteTotalWidth(
    columnCounts,
    maxUnitPx,
    baseGapPx,
    sectionGapPx,
  );

  if (totalAtMax <= availableWidth) {
    return { unitPx: maxUnitPx, gapPx: baseGapPx };
  }

  const scale = availableWidth / totalAtMax;
  let unitPx = Math.max(minUnitPx, Math.floor(maxUnitPx * scale));
  const gapPx = Math.max(2, Math.round(baseGapPx * scale));

  while (
    unitPx > minUnitPx &&
    computePaletteTotalWidth(columnCounts, unitPx, gapPx, sectionGapPx) >
      availableWidth
  ) {
    unitPx -= 1;
  }

  return { unitPx, gapPx };
}

export function computePaletteColumnCounts(
  sectionCharCounts: readonly number[],
  targetRows: number,
): readonly number[] {
  return sectionCharCounts.map((count) =>
    computePaletteColumnCount(count, targetRows),
  );
}

export function paletteUnitFontSize(unitPx: number): string {
  if (unitPx >= 52) {
    return "0.875rem";
  }
  if (unitPx >= 44) {
    return "0.8125rem";
  }
  if (unitPx >= 38) {
    return "0.75rem";
  }
  return "0.625rem";
}

export function paletteCustomLabelFontSize(unitPx: number): string {
  if (unitPx >= 52) {
    return "0.5625rem";
  }
  if (unitPx >= 44) {
    return "0.5rem";
  }
  return "0.4375rem";
}
