import type { CorpusPresetId } from "./client-presets";
import { parseNgramArtifact } from "./parse-artifact";
import type { NgramStats } from "./types";

const artifactCache = new Map<CorpusPresetId, NgramStats>();

/** Fetch and parse a preset n-gram artifact (client-side, E6). */
export async function fetchPresetNgramStats(
  presetId: CorpusPresetId,
): Promise<NgramStats> {
  const cached = artifactCache.get(presetId);
  if (cached) {
    return cached;
  }

  const response = await fetch(`/api/corpus/${presetId}`);
  if (!response.ok) {
    throw new Error(`بارگذاری corpus ناموفق بود (${response.status})`);
  }

  const json = await response.text();
  const stats = parseNgramArtifact(json);
  if (stats.corpusId !== presetId) {
    throw new Error(
      `corpusId ناسازگار: انتظار ${presetId}، دریافت ${stats.corpusId}`,
    );
  }

  artifactCache.set(presetId, stats);
  return stats;
}

/** Clear in-memory artifact cache (for tests). */
export function clearArtifactCache(): void {
  artifactCache.clear();
}
