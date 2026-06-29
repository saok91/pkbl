import { extractNgrams } from "@/lib/corpus/ngram-extract";
import { LruCache } from "@/lib/corpus/lru-cache";
import type { NgramStats } from "@/lib/corpus/types";

const MAX_CUSTOM_CORPUS_CACHE_ENTRIES = 50;

const CUSTOM_CORPUS_CACHE = new LruCache<string, NgramStats>(
  MAX_CUSTOM_CORPUS_CACHE_ENTRIES,
);

/** Server-side LRU cache for custom corpus analysis (architecture §6.1). */
export function analyzeCustomText(text: string): NgramStats {
  const cached = CUSTOM_CORPUS_CACHE.get(text);
  if (cached) {
    return cached;
  }

  const stats = extractNgrams(text, "custom");
  CUSTOM_CORPUS_CACHE.set(text, stats);
  return stats;
}

/** Test helper — clears in-memory custom corpus cache. */
export function clearCustomCorpusCache(): void {
  CUSTOM_CORPUS_CACHE.clear();
}

/** Test helper — current custom corpus cache size. */
export function getCustomCorpusCacheSize(): number {
  return CUSTOM_CORPUS_CACHE.size;
}
