import { describe, expect, it } from "vitest";

import { KEY_UNIT_PX } from "./constants";
import {
  computePaletteColumnCount,
  computePaletteColumnCounts,
  computePaletteTargetRows,
  computePaletteTotalWidth,
  computePaletteUnitSize,
  computeSectionGridWidth,
} from "./palette-grid";

describe("computePaletteTargetRows", () => {
  it("returns ceil(sqrt(max section size))", () => {
    expect(computePaletteTargetRows([32, 11, 10])).toBe(6);
    expect(computePaletteTargetRows([9])).toBe(3);
    expect(computePaletteTargetRows([])).toBe(1);
  });
});

describe("computePaletteColumnCount", () => {
  it("fits chars into at most targetRows rows per column", () => {
    const targetRows = 6;
    expect(computePaletteColumnCount(32, targetRows)).toBe(6);
    expect(computePaletteColumnCount(11, targetRows)).toBe(2);
    expect(computePaletteColumnCount(5, targetRows)).toBe(1);
  });
});

describe("computePaletteUnitSize", () => {
  const columnCounts = [6, 2, 2, 1, 1, 2, 5];

  it("keeps keyboard key size when container is wide enough", () => {
    const wide =
      computePaletteTotalWidth(columnCounts, KEY_UNIT_PX, 5, 12) + 10;
    const result = computePaletteUnitSize(columnCounts, wide);
    expect(result.unitPx).toBe(KEY_UNIT_PX);
  });

  it("scales down to fit all sections on one row", () => {
    const narrow = 900;
    const result = computePaletteUnitSize(columnCounts, narrow, {
      sectionGapPx: 12,
    });
    expect(result.unitPx).toBeLessThan(KEY_UNIT_PX);
    expect(
      computePaletteTotalWidth(columnCounts, result.unitPx, result.gapPx, 12),
    ).toBeLessThanOrEqual(narrow);
  });
});

describe("computeSectionGridWidth", () => {
  it("includes internal gaps between columns", () => {
    expect(computeSectionGridWidth(6, 56, 5)).toBe(6 * 56 + 5 * 5);
  });
});

describe("computePaletteColumnCounts", () => {
  it("returns column count per section", () => {
    expect(computePaletteColumnCounts([32, 11], 6)).toEqual([6, 2]);
  });
});
