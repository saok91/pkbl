import { describe, expect, it } from "vitest";

import {
  assignChar,
  getBlankAnsiTemplate,
  getDefaultTemplate,
} from "@/lib/layout";
import { keyIdAt } from "@/lib/layout/test-utils";
import { SCORING_CONFIG_V1, SCORING_WEIGHTS_V1 } from "./config";
import { computeScore } from "./compute-score";
import { buildGoldenLayout, buildGoldenNgramStats } from "./fixtures/golden";

describe("computeScore", () => {
  it("returns higher total for home-row Persian layout vs missing assignments", () => {
    const layout = buildGoldenLayout();
    const stats = buildGoldenNgramStats();
    const assigned = computeScore(layout, stats);
    const unassigned = computeScore(getBlankAnsiTemplate(), stats);

    expect(assigned.total).toBeGreaterThan(unassigned.total);
    expect(assigned.scorerVersion).toBe("1.0.0");
  });

  it("includes unigram breakdown and hotspots", () => {
    const result = computeScore(buildGoldenLayout(), buildGoldenNgramStats());

    expect(result.breakdown.unigramCost).toBeGreaterThan(0);
    expect(result.breakdown.unigramScore).toBeLessThan(0);
    expect(result.hotspots.length).toBeGreaterThan(0);
    expect(result.hotspots[0]?.char).toBeDefined();
    expect(result.hotspots.length).toBeLessThanOrEqual(
      SCORING_CONFIG_V1.hotspotTopN,
    );
  });

  it("tracks bigram same-finger and hand alternation metrics", () => {
    const layout = getBlankAnsiTemplate();
    const dKey = keyIdAt("D");
    const fKey = keyIdAt("F");
    const jKey = keyIdAt("J");

    const sameHandLayout = assignChar(
      assignChar(layout, dKey, "base", "ا"),
      fKey,
      "base",
      "ن",
    );
    const altHandLayout = assignChar(
      assignChar(layout, fKey, "base", "ا"),
      jKey,
      "base",
      "ن",
    );

    const stats = {
      unigrams: new Map([
        ["ا", 10],
        ["ن", 10],
      ]),
      bigrams: new Map([["ان", 20]]),
      trigrams: new Map<string, number>(),
      totalChars: 20,
      corpusId: "bigram-test",
      normalizedVersion: "norm-v1",
    };

    const sameHand = computeScore(sameHandLayout, stats);
    const altHand = computeScore(altHandLayout, stats);

    expect(sameHand.breakdown.sameHandBigrams).toBeGreaterThan(
      altHand.breakdown.sameHandBigrams,
    );
    expect(altHand.breakdown.handAlternation).toBeGreaterThan(
      sameHand.breakdown.handAlternation,
    );
    expect(altHand.total).toBeGreaterThan(sameHand.total);
  });

  it("tracks trigram row switching in breakdown", () => {
    const layout = getBlankAnsiTemplate();
    const fKey = keyIdAt("F");
    const qKey = keyIdAt("Q");

    const homeToTop = assignChar(
      assignChar(layout, fKey, "base", "ا"),
      qKey,
      "base",
      "ن",
    );

    const stats = {
      unigrams: new Map([
        ["ا", 5],
        ["ن", 5],
        ["ت", 5],
      ]),
      bigrams: new Map([
        ["ان", 5],
        ["نت", 5],
      ]),
      trigrams: new Map([["انت", 5]]),
      totalChars: 15,
      corpusId: "trigram-test",
      normalizedVersion: "norm-v1",
    };

    const result = computeScore(homeToTop, stats);
    expect(result.breakdown.trigramCost).not.toBe(0);
    expect(result.breakdown.bigramRowSwitching).toBeGreaterThan(0);
    expect(result.breakdown.trigramRowSwitching).toBeGreaterThan(0);
    expect(result.breakdown.rowSwitching).toBe(
      result.breakdown.bigramRowSwitching +
        result.breakdown.trigramRowSwitching,
    );
  });

  it("reports aggregate ergonomics metrics", () => {
    const result = computeScore(buildGoldenLayout(), buildGoldenNgramStats());

    expect(result.breakdown.homeRowUsage).toBeGreaterThan(50);
    expect(result.breakdown.handBalance).toBeGreaterThan(0);
    expect(result.breakdown.weakKeyPenalty).toBeGreaterThanOrEqual(0);

    const fingerSum = Object.values(result.breakdown.fingerLoad).reduce(
      (sum, value) => sum + value,
      0,
    );
    expect(fingerSum).toBeCloseTo(1, 5);
  });

  it("applies missing-char penalty for unassigned corpus chars", () => {
    const stats = {
      unigrams: new Map([["ا", 100]]),
      bigrams: new Map<string, number>(),
      trigrams: new Map<string, number>(),
      totalChars: 100,
      corpusId: "missing",
      normalizedVersion: "norm-v1",
    };

    const missing = computeScore(getBlankAnsiTemplate(), stats);
    expect(missing.breakdown.unigramCost).toBeGreaterThan(100);
    expect(missing.breakdown.weakKeyPenalty).toBe(0);
  });

  it("changes score predictably when weights change", () => {
    const layout = buildGoldenLayout();
    const stats = buildGoldenNgramStats();

    const baseline = computeScore(layout, stats);
    const heavyBigram = computeScore(layout, stats, {
      ...SCORING_CONFIG_V1,
      weights: { ...SCORING_WEIGHTS_V1, bigram: 3 },
    });

    expect(heavyBigram.total).toBeLessThan(baseline.total);
    expect(heavyBigram.breakdown.bigramScore).toBeLessThan(
      baseline.breakdown.bigramScore,
    );
  });

  it("penalizes same-finger bigrams more than same-hand different-finger", () => {
    const layout = getBlankAnsiTemplate();
    const fKey = keyIdAt("F");
    const gKey = keyIdAt("G");
    const dKey = keyIdAt("D");

    const sameFingerLayout = assignChar(
      assignChar(layout, fKey, "base", "ا"),
      gKey,
      "base",
      "ن",
    );
    const sameHandLayout = assignChar(
      assignChar(layout, dKey, "base", "ا"),
      gKey,
      "base",
      "ن",
    );

    const stats = {
      unigrams: new Map([
        ["ا", 10],
        ["ن", 10],
      ]),
      bigrams: new Map([["ان", 20]]),
      trigrams: new Map<string, number>(),
      totalChars: 20,
      corpusId: "same-finger-test",
      normalizedVersion: "norm-v1",
    };

    const sameFinger = computeScore(sameFingerLayout, stats);
    const sameHand = computeScore(sameHandLayout, stats);

    expect(sameFinger.breakdown.sameFingerBigrams).toBeGreaterThan(
      sameHand.breakdown.sameFingerBigrams,
    );
    expect(sameHand.total).toBeGreaterThan(sameFinger.total);
  });

  it("scores shift-layer assignments", () => {
    const layout = getDefaultTemplate();
    const jKey = keyIdAt("J");
    const withShift = assignChar(layout, jKey, "shift", "؟");

    const stats = {
      unigrams: new Map([["؟", 50]]),
      bigrams: new Map<string, number>(),
      trigrams: new Map<string, number>(),
      totalChars: 50,
      corpusId: "shift-test",
      normalizedVersion: "norm-v1",
    };

    const assigned = computeScore(withShift, stats);
    const unassigned = computeScore(getBlankAnsiTemplate(), stats);

    expect(assigned.total).toBeGreaterThan(unassigned.total);
    expect(assigned.breakdown.unigramCost).toBeLessThan(
      unassigned.breakdown.unigramCost,
    );
  });

  it("normalizes fingerLoad by unigram weight when totalChars differs", () => {
    const layout = buildGoldenLayout();
    const stats = {
      unigrams: new Map([
        ["ا", 30],
        ["ن", 20],
      ]),
      bigrams: new Map<string, number>(),
      trigrams: new Map<string, number>(),
      totalChars: 100,
      corpusId: "finger-load-norm",
      normalizedVersion: "norm-v1",
    };

    const result = computeScore(layout, stats);
    const fingerSum = Object.values(result.breakdown.fingerLoad).reduce(
      (sum, value) => sum + value,
      0,
    );

    expect(fingerSum).toBeCloseTo(1, 5);
  });

  it("returns baseScore for empty ngram stats", () => {
    const stats = {
      unigrams: new Map<string, number>(),
      bigrams: new Map<string, number>(),
      trigrams: new Map<string, number>(),
      totalChars: 0,
      corpusId: "empty",
      normalizedVersion: "norm-v1",
    };

    const result = computeScore(buildGoldenLayout(), stats);
    expect(result.total).toBe(SCORING_CONFIG_V1.baseScore);
    expect(result.breakdown.unigramCost).toBe(0);
    expect(result.hotspots).toEqual([]);
  });

  it("allows total above baseScore when hand alternation dominates", () => {
    const layout = getBlankAnsiTemplate();
    const fKey = keyIdAt("F");
    const jKey = keyIdAt("J");
    const altLayout = assignChar(
      assignChar(layout, fKey, "base", "ا"),
      jKey,
      "base",
      "ن",
    );

    const stats = {
      unigrams: new Map([
        ["ا", 1],
        ["ن", 1],
      ]),
      bigrams: new Map([["ان", 10_000]]),
      trigrams: new Map<string, number>(),
      totalChars: 10_002,
      corpusId: "alternation-bonus",
      normalizedVersion: "norm-v1",
    };

    const result = computeScore(altLayout, stats);

    expect(result.breakdown.bigramCost).toBeLessThan(0);
    expect(result.breakdown.bigramScore).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(SCORING_CONFIG_V1.baseScore);
  });
});

describe("computeScore golden fixture", () => {
  it("is deterministic for fixed layout, corpus, and config", () => {
    const layout = buildGoldenLayout();
    const stats = buildGoldenNgramStats();

    const first = computeScore(layout, stats);
    const second = computeScore(layout, stats);

    expect(second).toEqual(first);
    expect(first.scorerVersion).toBe("1.0.0");
    expect(first.total).toBeCloseTo(965.5137931034483, 10);
    expect(first.breakdown.homeRowUsage).toBeCloseTo(100, 5);
    expect(first.hotspots.length).toBeGreaterThan(0);
  });
});
