import type { NgramArtifact, NgramStats } from "./types";

/** Convert runtime stats to a JSON-serializable artifact. */
export function ngramStatsToArtifact(
  stats: NgramStats,
  version: string,
  builtAt: string,
): NgramArtifact {
  return {
    corpusId: stats.corpusId,
    version,
    normalizedVersion: stats.normalizedVersion,
    charCount: stats.totalChars,
    builtAt,
    unigrams: Object.fromEntries(stats.unigrams),
    bigrams: Object.fromEntries(stats.bigrams),
    trigrams: Object.fromEntries(stats.trigrams),
  };
}

function recordToMap(
  record: Readonly<Record<string, number>>,
): ReadonlyMap<string, number> {
  return new Map(Object.entries(record));
}

/** Parse a precomputed artifact into runtime NgramStats. */
export function artifactToNgramStats(artifact: NgramArtifact): NgramStats {
  return {
    unigrams: recordToMap(artifact.unigrams),
    bigrams: recordToMap(artifact.bigrams),
    trigrams: recordToMap(artifact.trigrams),
    totalChars: artifact.charCount,
    corpusId: artifact.corpusId,
    normalizedVersion: artifact.normalizedVersion,
  };
}
