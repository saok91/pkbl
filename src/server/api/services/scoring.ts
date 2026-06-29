import { loadPresetNgramStats } from "@/lib/corpus/load-artifact";
import type { NgramStats } from "@/lib/corpus/types";
import { getPresetById } from "@/lib/corpus/presets";
import type { Layout } from "@/lib/layout/types";
import { computeScore } from "@/lib/scoring";
import type { ScoreResult } from "@/lib/scoring/types";

import { analyzeCustomText } from "@/lib/corpus/analyze-custom";

export async function resolveNgramStats(
  corpusPresetId: string,
  customText?: string,
): Promise<NgramStats> {
  if (customText !== undefined) {
    return analyzeCustomText(customText);
  }

  const preset = getPresetById(corpusPresetId);
  if (!preset) {
    throw new Error(`Unknown corpus preset: ${corpusPresetId}`);
  }

  return loadPresetNgramStats(corpusPresetId);
}

export function evaluateLayoutScore(
  layout: Layout,
  ngramStats: NgramStats,
): ScoreResult {
  return computeScore(layout, ngramStats);
}

export type CompareScoreResult = {
  readonly results: readonly ScoreResult[];
  readonly ranking: readonly number[];
};

export function compareLayoutScores(
  layouts: readonly Layout[],
  ngramStats: NgramStats,
): CompareScoreResult {
  const results = layouts.map((layout) => computeScore(layout, ngramStats));
  const ranking = results
    .map((result, index) => ({ index, total: result.total }))
    .sort((left, right) => right.total - left.total)
    .map((entry) => entry.index);

  return { results, ranking };
}
