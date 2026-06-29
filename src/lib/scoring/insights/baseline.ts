import type { CorpusPresetId } from "@/lib/corpus/client-presets";
import type { NgramStats } from "@/lib/corpus/types";
import { getDefaultTemplate } from "@/lib/layout/kle-parser";
import { computeScore } from "@/lib/scoring/compute-score";

import type { BaselineDelta } from "./types";

const baselineCache = new Map<string, number>();

function cacheKey(presetId: CorpusPresetId, ngramStats: NgramStats): string {
  return `${presetId}:${ngramStats.corpusId}:${ngramStats.normalizedVersion}`;
}

/** Cached baseline score for the default 60% Persian Standard layout (E15-S4 logic). */
export function getBaselineScore(
  presetId: CorpusPresetId,
  ngramStats: NgramStats,
): number {
  const key = cacheKey(presetId, ngramStats);
  const cached = baselineCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const layout = getDefaultTemplate();
  const result = computeScore(layout, ngramStats);
  baselineCache.set(key, result.total);
  return result.total;
}

/** Clears baseline cache — for tests only. */
export function clearBaselineCache(): void {
  baselineCache.clear();
}

export function computeBaselineDelta(
  total: number,
  baselineTotal: number,
): BaselineDelta {
  if (baselineTotal === 0) {
    return { absolute: total, percent: 0 };
  }
  const absolute = total - baselineTotal;
  const percent = (absolute / baselineTotal) * 100;
  return { absolute, percent };
}
