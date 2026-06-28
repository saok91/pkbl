export {
  CHAR_VARIANT_MAP,
  CORPUS_TARGET_CHARSET_SET,
  DEFAULT_NORMALIZATION_CONFIG,
  LATIN_TO_PERSIAN_DIGIT,
  NORMALIZATION_CONFIG_V1,
  PERSIAN_TO_LATIN_DIGIT,
  REMOVED_ZERO_WIDTH_CHARS,
} from "./config";
export type { DigitPolicy, NormalizationConfig } from "./config";

export {
  loadPresetNgramStats,
  parseNgramArtifact,
  resolvePresetArtifactPath,
} from "./load-artifact";

export { extractNgrams, mergeNgramStats } from "./ngram-extract";
export { normalizePersianText } from "./normalize-fa";
export type { NormalizeResult } from "./normalize-fa";

export {
  DEFAULT_CORPUS_DATA_DIR,
  DEFAULT_MANIFEST_PATH,
  getPresetById,
  listPresets,
} from "./presets";
export { artifactToNgramStats, ngramStatsToArtifact } from "./serialize";

export type {
  CorpusPreset,
  NgramArtifact,
  NgramStats,
  NormalizedVersion,
} from "./types";

/** Domain module marker for boundary tests. */
export const CORPUS_MODULE = "corpus" as const;
