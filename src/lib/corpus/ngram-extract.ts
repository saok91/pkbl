import {
  CORPUS_TARGET_CHARSET_SET,
  DEFAULT_NORMALIZATION_CONFIG,
  type NormalizationConfig,
} from "./config";
import { normalizePersianText } from "./normalize-fa";
import type { NgramStats } from "./types";

function incrementCount(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function filterTargetChars(text: string): string[] {
  return [...text].filter((char) => CORPUS_TARGET_CHARSET_SET.has(char));
}

function buildNgramMaps(chars: readonly string[]): {
  unigrams: ReadonlyMap<string, number>;
  bigrams: ReadonlyMap<string, number>;
  trigrams: ReadonlyMap<string, number>;
} {
  const unigrams = new Map<string, number>();
  const bigrams = new Map<string, number>();
  const trigrams = new Map<string, number>();

  for (let index = 0; index < chars.length; index += 1) {
    const current = chars[index];
    if (current === undefined) {
      continue;
    }
    incrementCount(unigrams, current);

    const next = chars[index + 1];
    if (next !== undefined) {
      incrementCount(bigrams, current + next);
    }

    const third = chars[index + 2];
    if (next !== undefined && third !== undefined) {
      incrementCount(trigrams, current + next + third);
    }
  }

  return { unigrams, bigrams, trigrams };
}

/** Extract unigram/bigram/trigram frequencies from normalized text (E3-S2). */
export function extractNgrams(
  text: string,
  corpusId: string,
  config: NormalizationConfig = DEFAULT_NORMALIZATION_CONFIG,
): NgramStats {
  const { text: normalizedText, normalizedVersion } = normalizePersianText(
    text,
    config,
  );
  const chars = filterTargetChars(normalizedText);
  const { unigrams, bigrams, trigrams } = buildNgramMaps(chars);

  return {
    unigrams,
    bigrams,
    trigrams,
    totalChars: chars.length,
    corpusId,
    normalizedVersion,
  };
}

/** Merge multiple NgramStats into one aggregate (used by corpus-build). */
export function mergeNgramStats(
  corpusId: string,
  normalizedVersion: string,
  parts: readonly NgramStats[],
): NgramStats {
  const unigrams = new Map<string, number>();
  const bigrams = new Map<string, number>();
  const trigrams = new Map<string, number>();
  let totalChars = 0;

  for (const part of parts) {
    if (part.normalizedVersion !== normalizedVersion) {
      throw new Error(
        `Normalized version mismatch: expected "${normalizedVersion}", got "${part.normalizedVersion}"`,
      );
    }
    totalChars += part.totalChars;
    for (const [key, count] of part.unigrams) {
      unigrams.set(key, (unigrams.get(key) ?? 0) + count);
    }
    for (const [key, count] of part.bigrams) {
      bigrams.set(key, (bigrams.get(key) ?? 0) + count);
    }
    for (const [key, count] of part.trigrams) {
      trigrams.set(key, (trigrams.get(key) ?? 0) + count);
    }
  }

  return {
    unigrams,
    bigrams,
    trigrams,
    totalChars,
    corpusId,
    normalizedVersion,
  };
}
