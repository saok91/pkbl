import {
  DEFAULT_ERGONOMICS_CONFIG,
  ERGONOMICS_CONFIG_V1,
  type ErgonomicsConfig,
} from "@/lib/ergonomics/config";

/**
 * Versioned scoring configuration.
 * Ergonomics penalties are embedded here for reproducible score snapshots.
 */
export type ScoringConfig = {
  version: number;
  ergonomics: ErgonomicsConfig;
};

export const SCORING_CONFIG_V1: ScoringConfig = {
  version: 1,
  ergonomics: ERGONOMICS_CONFIG_V1,
};

/** Default scoring config (latest stable version). */
export const DEFAULT_SCORING_CONFIG = SCORING_CONFIG_V1;

/** Resolve ergonomics config from a scoring config (convenience for E4). */
export function getErgonomicsFromScoringConfig(
  config: ScoringConfig = DEFAULT_SCORING_CONFIG,
): ErgonomicsConfig {
  return config.ergonomics;
}
