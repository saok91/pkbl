import { describe, expect, it } from "vitest";

import {
  assignChar,
  getBlankAnsiTemplate,
  getDefaultTemplate,
} from "@/lib/layout";
import { keyIdAt } from "@/lib/layout/test-utils";

import {
  getAssignedCharSets,
  getPaletteCharAssignment,
} from "./palette-char-state";

describe("getPaletteCharAssignment", () => {
  it("returns free when char is unassigned on both layers", () => {
    const layout = getBlankAnsiTemplate();
    const sets = getAssignedCharSets(layout);
    expect(getPaletteCharAssignment("ا", sets.base, sets.shift)).toBe("free");
  });

  it("returns base when assigned on base layer only", () => {
    const layout = getDefaultTemplate();
    const updated = assignChar(layout, keyIdAt("D"), "base", "ا");
    const sets = getAssignedCharSets(updated);
    expect(getPaletteCharAssignment("ا", sets.base, sets.shift)).toBe("base");
  });

  it("returns shift when assigned on shift layer only", () => {
    const layout = getDefaultTemplate();
    const updated = assignChar(layout, keyIdAt("D"), "shift", "آ");
    const sets = getAssignedCharSets(updated);
    expect(getPaletteCharAssignment("آ", sets.base, sets.shift)).toBe("shift");
  });

  it("prefers base when assigned on both layers", () => {
    const layout = getDefaultTemplate();
    let updated = assignChar(layout, keyIdAt("D"), "base", "ا");
    updated = assignChar(updated, keyIdAt("F"), "shift", "ا");
    const sets = getAssignedCharSets(updated);
    expect(getPaletteCharAssignment("ا", sets.base, sets.shift)).toBe("base");
  });
});
