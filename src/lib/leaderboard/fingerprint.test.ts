import { describe, expect, it } from "vitest";

import { getDefaultTemplate } from "@/lib/layout/kle-parser";
import { assignChar } from "@/lib/layout/operations";
import { keyIdAt } from "@/lib/layout/test-utils";

import { computeLayoutFingerprint } from "./fingerprint";
import { computeRank, evaluateSubmitScore } from "./submit-rules";

describe("computeLayoutFingerprint", () => {
  it("is stable for the same layout", () => {
    const layout = getDefaultTemplate();
    expect(computeLayoutFingerprint(layout)).toBe(
      computeLayoutFingerprint(layout),
    );
  });

  it("changes when assignments change", () => {
    const layout = getDefaultTemplate();
    const modified = assignChar(layout, keyIdAt("Q"), "base", "ث");

    expect(computeLayoutFingerprint(modified)).not.toBe(
      computeLayoutFingerprint(layout),
    );
  });

  it("is independent of assignment iteration order", () => {
    const layout = getDefaultTemplate();
    const reordered: typeof layout = {
      ...layout,
      assignments: new Map([...layout.assignments.entries()].reverse()),
    };

    expect(computeLayoutFingerprint(reordered)).toBe(
      computeLayoutFingerprint(layout),
    );
  });
});

describe("evaluateSubmitScore", () => {
  it("accepts first entry", () => {
    expect(evaluateSubmitScore(900, null)).toEqual({
      accepted: true,
      reason: "first_entry",
    });
  });

  it("accepts when score beats current best", () => {
    expect(evaluateSubmitScore(950, 900)).toEqual({
      accepted: true,
      reason: "new_best",
    });
  });

  it("rejects when score is not better", () => {
    expect(evaluateSubmitScore(850, 900)).toEqual({
      accepted: false,
      reason: "score_too_low",
    });
  });
});

describe("computeRank", () => {
  it("returns rank 1 when no higher scores exist", () => {
    expect(computeRank(950, [])).toBe(1);
  });

  it("returns correct rank among higher scores", () => {
    expect(computeRank(920, [950, 940, 910])).toBe(3);
  });
});
