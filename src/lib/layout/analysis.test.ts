import { describe, expect, it } from "vitest";

import { EDITABLE_CHARSET, EDITABLE_CHARSET_SET } from "./editable-scope";
import {
  getCompletenessScore,
  getDuplicateAssignments,
  getUnassignedChars,
} from "./analysis";
import { getBlankAnsiTemplate, getDefaultTemplate } from "./kle-parser";
import { assignChar } from "./operations";
import { findKeyIdByBaseChar, keyIdAt } from "./test-utils";

describe("getUnassignedChars", () => {
  it("returns chars not assigned in layout", () => {
    const layout = getBlankAnsiTemplate();
    const unassigned = getUnassignedChars(layout, "اب");
    expect(unassigned).toEqual(["ا", "ب"]);
  });

  it("excludes assigned chars", () => {
    const layout = getBlankAnsiTemplate();
    const qKey = keyIdAt("Q");
    const withA = assignChar(layout, qKey, "base", "ا");
    const unassigned = getUnassignedChars(withA, "اب");
    expect(unassigned).toEqual(["ب"]);
  });

  it("assigns Persian Standard letters on default template", () => {
    const layout = getDefaultTemplate();
    expect(getUnassignedChars(layout, "اب")).toEqual([]);
    expect(findKeyIdByBaseChar(layout, "ا")).toBe(keyIdAt("H"));
    expect(findKeyIdByBaseChar(layout, "ب")).toBe(keyIdAt("F"));
  });
});

describe("getDuplicateAssignments", () => {
  it("detects duplicate char on multiple keys", () => {
    const layout = getBlankAnsiTemplate();
    const qKey = keyIdAt("Q");
    const wKey = keyIdAt("W");

    let current = assignChar(layout, qKey, "base", "ا");
    current = assignChar(current, wKey, "base", "ا");

    const duplicates = getDuplicateAssignments(current);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0]?.char).toBe("ا");
    expect(duplicates[0]?.keyIds).toContain(qKey);
    expect(duplicates[0]?.keyIds).toContain(wKey);
  });

  it("returns empty when no duplicates on blank template", () => {
    const layout = getBlankAnsiTemplate();
    expect(getDuplicateAssignments(layout)).toEqual([]);
  });

  it("may duplicate ZWNJ on shift in Persian Standard (B + Space)", () => {
    const layout = getDefaultTemplate();
    const zwnjDupes = getDuplicateAssignments(layout).filter(
      (d) => d.char === "\u200c" && d.layer === "shift",
    );
    expect(zwnjDupes).toHaveLength(1);
    expect(zwnjDupes[0]?.keyIds).toContain("R3C5");
    expect(zwnjDupes[0]?.keyIds).toContain("R4C3");
  });
});

describe("getCompletenessScore", () => {
  it("returns 0 for blank ANSI template vs Persian charset", () => {
    const layout = getBlankAnsiTemplate();
    expect(getCompletenessScore(layout, "اب")).toBe(0);
  });

  it("returns 100 when all charset chars assigned", () => {
    const layout = getBlankAnsiTemplate();
    const qKey = keyIdAt("Q");
    const wKey = keyIdAt("W");

    let current = assignChar(layout, qKey, "base", "ا");
    current = assignChar(current, wKey, "base", "ب");

    expect(getCompletenessScore(current, "اب")).toBe(100);
  });

  it("covers full Persian Standard charset on default layout", () => {
    const layout = getDefaultTemplate();
    expect(getCompletenessScore(layout)).toBe(100);
  });

  it("uses full editable charset by default", () => {
    const layout = getDefaultTemplate();
    const scoreDefault = getCompletenessScore(layout);
    const scoreExplicit = getCompletenessScore(
      layout,
      [...EDITABLE_CHARSET_SET].join(""),
    );
    expect(scoreDefault).toBe(scoreExplicit);
    expect(scoreDefault).toBeGreaterThanOrEqual(0);
    expect(scoreDefault).toBeLessThanOrEqual(100);
    expect(EDITABLE_CHARSET.length).toBeGreaterThan(0);
  });

  it("returns 100 for empty charset", () => {
    const layout = getDefaultTemplate();
    expect(getCompletenessScore(layout, "")).toBe(100);
  });
});
