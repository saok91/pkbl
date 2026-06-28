export {
  DEFAULT_SCORING_CONFIG,
  SCORING_CONFIG_V1,
  SCORING_WEIGHTS_V1,
  getErgonomicsFromScoringConfig,
} from "./config";
export type { ScoringConfig, ScoringWeights } from "./config";

export { buildCharLookup, resolveChar } from "./char-lookup";
export { computeScore } from "./compute-score";

export type {
  CharResolution,
  ScoreBreakdown,
  ScoreHotspot,
  ScoreResult,
} from "./types";

/** Domain module marker for boundary tests. */
export const SCORING_MODULE = "scoring" as const;
