import { describe, expect, it } from "vitest";

import { ERGONOMICS_CONFIG_V1 } from "@/lib/ergonomics";
import { assignChar, getDefaultTemplate } from "@/lib/layout";
import { keyIdAt } from "@/lib/layout/test-utils";
import {
  DEFAULT_SCORING_CONFIG,
  SCORING_CONFIG_V1,
  SCORING_WEIGHTS_V1,
  getErgonomicsFromScoringConfig,
} from "./config";
import { computeScore } from "./compute-score";

describe("ScoringConfig", () => {
  it("embeds versioned ergonomics config and semver scorerVersion", () => {
    expect(SCORING_CONFIG_V1.version).toBe(1);
    expect(SCORING_CONFIG_V1.scorerVersion).toBe("1.0.0");
    expect(SCORING_CONFIG_V1.ergonomics).toBe(ERGONOMICS_CONFIG_V1);
    expect(SCORING_CONFIG_V1.weights).toBe(SCORING_WEIGHTS_V1);
    expect(DEFAULT_SCORING_CONFIG).toBe(SCORING_CONFIG_V1);
  });

  it("resolves ergonomics from scoring config", () => {
    expect(getErgonomicsFromScoringConfig()).toBe(ERGONOMICS_CONFIG_V1);
  });

  it("changes total predictably when unigram weight changes", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");
    const scoredLayout = assignChar(layout, qKey, "base", "ق");

    const stats = {
      unigrams: new Map([["ق", 100]]),
      bigrams: new Map<string, number>(),
      trigrams: new Map<string, number>(),
      totalChars: 100,
      corpusId: "test",
      normalizedVersion: "norm-v1",
    };

    const lowWeight = computeScore(scoredLayout, stats, {
      ...SCORING_CONFIG_V1,
      weights: { ...SCORING_WEIGHTS_V1, unigram: 0.5 },
    });
    const highWeight = computeScore(scoredLayout, stats, {
      ...SCORING_CONFIG_V1,
      weights: { ...SCORING_WEIGHTS_V1, unigram: 2 },
    });

    expect(highWeight.total).toBeLessThan(lowWeight.total);
    expect(highWeight.breakdown.unigramScore).toBeLessThan(
      lowWeight.breakdown.unigramScore,
    );
  });
});
