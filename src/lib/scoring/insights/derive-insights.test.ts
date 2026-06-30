import { describe, expect, it } from "vitest";

import type { ScoreBreakdown } from "@/lib/scoring/types";

import { deriveInsights, partitionInsights } from "./derive-insights";

function buildBreakdown(
  overrides: Partial<ScoreBreakdown> = {},
): ScoreBreakdown {
  return {
    unigramCost: 10,
    bigramCost: 5,
    trigramCost: 2,
    unigramScore: -100,
    bigramScore: -50,
    trigramScore: -20,
    homeRowUsage: 60,
    fingerLoad: {
      thumb: 0.1,
      index: 0.25,
      middle: 0.25,
      ring: 0.2,
      pinky: 0.2,
    },
    handBalance: 0.95,
    leftHandShare: 0.48,
    rightHandShare: 0.52,
    sameFingerBigrams: 5,
    sameHandBigrams: 10,
    handAlternation: 15,
    bigramRowSwitching: 8,
    trigramRowSwitching: 4,
    rowSwitching: 12,
    weakKeyPenalty: 8,
    ...overrides,
  };
}

function buildBaseline(
  overrides: Partial<{ baselineTotal: number; incomplete: boolean }> = {},
) {
  return {
    baselineTotal: 1000,
    ...overrides,
  };
}

describe("deriveInsights", () => {
  it("returns strengths for good metrics and weaknesses for poor metrics", () => {
    const insights = deriveInsights(buildBreakdown(), buildBaseline());
    const { strengths, weaknesses } = partitionInsights(insights);

    expect(strengths.length).toBeGreaterThan(0);
    expect(strengths.every((item) => item.kind === "strength")).toBe(true);
    expect(weaknesses.every((item) => item.kind === "weakness")).toBe(true);
  });

  it("flags weakKeyPenalty as weakness when high", () => {
    const insights = deriveInsights(
      buildBreakdown({ weakKeyPenalty: 30, homeRowUsage: 30 }),
      buildBaseline(),
    );
    const { weaknesses } = partitionInsights(insights);

    expect(weaknesses.some((item) => item.metric === "weakKeyPenalty")).toBe(
      true,
    );
    expect(weaknesses.some((item) => item.metric === "homeRowUsage")).toBe(
      true,
    );
  });

  it("returns empty list when layout is incomplete", () => {
    expect(
      deriveInsights(buildBreakdown(), buildBaseline({ incomplete: true })),
    ).toEqual([]);
  });

  it("limits to three strengths and three weaknesses", () => {
    const allGood = deriveInsights(
      buildBreakdown({
        homeRowUsage: 80,
        handBalance: 0.98,
        sameFingerBigrams: 2,
        weakKeyPenalty: 3,
        rowSwitching: 5,
      }),
      buildBaseline(),
    );
    const allPoor = deriveInsights(
      buildBreakdown({
        homeRowUsage: 20,
        handBalance: 0.5,
        sameFingerBigrams: 25,
        weakKeyPenalty: 40,
        rowSwitching: 50,
      }),
      buildBaseline(),
    );

    expect(partitionInsights(allGood).strengths.length).toBeLessThanOrEqual(3);
    expect(partitionInsights(allPoor).weaknesses.length).toBeLessThanOrEqual(3);
  });
});
