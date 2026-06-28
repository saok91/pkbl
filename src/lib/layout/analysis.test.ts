import { describe, expect, it } from "vitest";

import { EDITABLE_CHARSET, EDITABLE_CHARSET_SET } from "./editable-scope";
import {
  getCompletenessScore,
  getDuplicateAssignments,
  getUnassignedChars,
} from "./analysis";
import { getDefaultTemplate } from "./kle-parser";
import { assignChar } from "./operations";
import { findKeyIdByLabel } from "./test-utils";

describe("getUnassignedChars", () => {
  it("returns chars not assigned in layout", () => {
    const layout = getDefaultTemplate();
    const unassigned = getUnassignedChars(layout, "اب");
    expect(unassigned).toEqual(["ا", "ب"]);
  });

  it("excludes assigned chars", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");
    const withA = assignChar(layout, qKey, "base", "ا");
    const unassigned = getUnassignedChars(withA, "اب");
    expect(unassigned).toEqual(["ب"]);
  });
});

describe("getDuplicateAssignments", () => {
  it("detects duplicate char on multiple keys", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");
    const wKey = findKeyIdByLabel(layout, "W");

    let current = assignChar(layout, qKey, "base", "ا");
    current = assignChar(current, wKey, "base", "ا");

    const duplicates = getDuplicateAssignments(current);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0]?.char).toBe("ا");
    expect(duplicates[0]?.keyIds).toContain(qKey);
    expect(duplicates[0]?.keyIds).toContain(wKey);
  });

  it("returns empty when no duplicates", () => {
    const layout = getDefaultTemplate();
    expect(getDuplicateAssignments(layout)).toEqual([]);
  });
});

describe("getCompletenessScore", () => {
  it("returns 0 for default English template vs Persian charset", () => {
    const layout = getDefaultTemplate();
    expect(getCompletenessScore(layout, "اب")).toBe(0);
  });

  it("returns 100 when all charset chars assigned", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");
    const wKey = findKeyIdByLabel(layout, "W");

    let current = assignChar(layout, qKey, "base", "ا");
    current = assignChar(current, wKey, "base", "ب");

    expect(getCompletenessScore(current, "اب")).toBe(100);
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
