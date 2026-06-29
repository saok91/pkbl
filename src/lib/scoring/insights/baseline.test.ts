import { describe, expect, it, beforeEach } from "vitest";

import {
  buildGoldenLayout,
  buildGoldenNgramStats,
} from "@/lib/scoring/fixtures/golden";
import { computeScore } from "@/lib/scoring/compute-score";
import { getDefaultTemplate } from "@/lib/layout/kle-parser";

import {
  clearBaselineCache,
  computeBaselineDelta,
  getBaselineScore,
} from "./baseline";

describe("baseline", () => {
  beforeEach(() => {
    clearBaselineCache();
  });

  it("computes baseline from default Persian Standard layout", () => {
    const stats = buildGoldenNgramStats();
    const baseline = getBaselineScore("wiki-fa", stats);
    const expected = computeScore(getDefaultTemplate(), stats).total;
    expect(baseline).toBe(expected);
  });

  it("caches baseline per preset", () => {
    const stats = buildGoldenNgramStats();
    const first = getBaselineScore("wiki-fa", stats);
    const second = getBaselineScore("wiki-fa", stats);
    expect(second).toBe(first);
  });

  it("returns positive delta when total exceeds baseline", () => {
    const delta = computeBaselineDelta(1100, 1000);
    expect(delta.percent).toBeGreaterThan(0);
    expect(delta.absolute).toBe(100);
  });

  it("golden custom layout delta is deterministic", () => {
    const stats = buildGoldenNgramStats();
    const baseline = getBaselineScore("wiki-fa", stats);
    const custom = computeScore(buildGoldenLayout(), stats).total;
    const delta = computeBaselineDelta(custom, baseline);
    expect(delta.percent).toBeTypeOf("number");
    expect(delta.absolute).toBe(custom - baseline);
  });

  it("returns negative percent when worse than baseline", () => {
    const delta = computeBaselineDelta(800, 1000);
    expect(delta.percent).toBeLessThan(0);
    expect(delta.absolute).toBe(-200);
  });
});
