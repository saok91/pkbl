import { describe, expect, it } from "vitest";

import { getBlankAnsiTemplate, getDefaultTemplate } from "@/lib/layout";
import { computeScore } from "@/lib/scoring";
import { buildGoldenNgramStats } from "@/lib/scoring/fixtures/golden";

import { deriveRankingHint, hasUnassignedEditableChars } from "./ranking-hints";

describe("deriveRankingHint", () => {
  it("suggests assigning missing chars when layout is incomplete", () => {
    const blank = getBlankAnsiTemplate();
    const breakdown = computeScore(blank, buildGoldenNgramStats()).breakdown;

    expect(hasUnassignedEditableChars(blank)).toBe(true);
    expect(deriveRankingHint({ layout: blank, breakdown })).toContain(
      "جایگاه ندارند",
    );
  });

  it("returns balanced hint when metrics are within thresholds", () => {
    const layout = getDefaultTemplate();
    const breakdown = computeScore(layout, buildGoldenNgramStats()).breakdown;
    const balancedBreakdown = {
      ...breakdown,
      unigramCost: 0,
      weakKeyPenalty: 0,
      sameFingerBigrams: 0,
      homeRowUsage: 60,
      handBalance: 0.95,
      rowSwitching: 0,
    };

    expect(
      deriveRankingHint({ layout, breakdown: balancedBreakdown }),
    ).toContain("متعادل");
  });

  it("prioritizes missing-char hint over ergonomics hints", () => {
    const blank = getBlankAnsiTemplate();
    const breakdown = {
      ...computeScore(blank, buildGoldenNgramStats()).breakdown,
      weakKeyPenalty: 999,
      sameFingerBigrams: 999,
    };

    expect(deriveRankingHint({ layout: blank, breakdown })).toContain(
      "جایگاه ندارند",
    );
  });
});
