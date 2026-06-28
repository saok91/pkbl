export {
  DEFAULT_SCORING_CONFIG,
  SCORING_CONFIG_V1,
  getErgonomicsFromScoringConfig,
} from "./config";
export type { ScoringConfig } from "./config";

/** Domain module marker for boundary tests. */
export const SCORING_MODULE = "scoring" as const;
