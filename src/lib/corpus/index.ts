export {
  CHAR_VARIANT_MAP,
  CHAR_VARIANT_MAP_V1,
  CHAR_VARIANT_MAP_V2,
  CORPUS_TARGET_CHARSET_SET,
  DEFAULT_NORMALIZATION_CONFIG,
  LATIN_TO_PERSIAN_DIGIT,
  NORMALIZATION_CONFIG_V1,
  NORMALIZATION_CONFIG_V2,
  PERSIAN_TO_LATIN_DIGIT,
  PUNCT_VARIANT_MAP,
  PUNCT_VARIANT_MAP_V1,
  PUNCT_VARIANT_MAP_V2,
  REMOVED_ZERO_WIDTH_CHARS,
  toPersianDigits,
} from "./config";
export type { DigitPolicy, NormalizationConfig } from "./config";

export { parseNgramArtifact } from "./parse-artifact";
export {
  loadPresetNgramStats,
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
export {
  CLIENT_CORPUS_PRESETS,
  CORPUS_PRESET_STORAGE_KEY,
  DEFAULT_CORPUS_PRESET_ID,
  readStoredCorpusPresetId,
  writeStoredCorpusPresetId,
} from "./client-presets";
export type { CorpusPresetId, ClientCorpusPreset } from "./client-presets";
export { analyzeCustomText, clearCustomCorpusCache } from "./analyze-custom";
export { clearArtifactCache, fetchPresetNgramStats } from "./fetch-artifact";
export { artifactToNgramStats, ngramStatsToArtifact } from "./serialize";

export type {
  CorpusPreset,
  NgramArtifact,
  NgramStats,
  NormalizedVersion,
} from "./types";

/** Domain module marker for boundary tests. */
export const CORPUS_MODULE = "corpus" as const;
