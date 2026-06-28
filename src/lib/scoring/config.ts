import {
  DEFAULT_ERGONOMICS_CONFIG,
  ERGONOMICS_CONFIG_V1,
  type ErgonomicsConfig,
} from "@/lib/ergonomics/config";

/** Weight table for n-gram signal combination (E4-S6). */
export type ScoringWeights = {
  /** Multiplier for unigram reach + weak-key costs. */
  readonly unigram: number;
  /** Multiplier for bigram transition costs. */
  readonly bigram: number;
  /** Multiplier for trigram transition costs. */
  readonly trigram: number;
  /** Penalty when a corpus char has no key assignment. */
  readonly missingCharPenalty: number;
  /** Extra cost when consecutive keys use the same finger. */
  readonly sameFingerBigram: number;
  /** Extra cost when consecutive keys use the same hand (different finger). */
  readonly sameHandBigram: number;
  /** Bonus subtracted when hands alternate between consecutive keys. */
  readonly handAlternationBonus: number;
  /** Extra cost when row changes between consecutive keys. */
  readonly rowSwitch: number;
};

/**
 * Versioned scoring configuration.
 * Ergonomics penalties and signal weights are embedded for reproducible snapshots.
 */
export type ScoringConfig = {
  readonly version: number;
  /** Semver string stored on ScoreSnapshot (E4-S1). */
  readonly scorerVersion: string;
  readonly ergonomics: ErgonomicsConfig;
  readonly weights: ScoringWeights;
  /** Base score before cost deductions — higher is better output range. */
  readonly baseScore: number;
  /** Scale applied when converting accumulated cost to score deduction. */
  readonly costScale: number;
  /** Number of top hotspots returned in ScoreResult. */
  readonly hotspotTopN: number;
};

export const SCORING_WEIGHTS_V1: ScoringWeights = {
  unigram: 1,
  bigram: 0.85,
  trigram: 0.55,
  missingCharPenalty: 4,
  sameFingerBigram: 1.15,
  sameHandBigram: 0.35,
  handAlternationBonus: 0.28,
  rowSwitch: 0.22,
};

export const SCORING_CONFIG_V1: ScoringConfig = {
  version: 1,
  scorerVersion: "1.0.0",
  ergonomics: ERGONOMICS_CONFIG_V1,
  weights: SCORING_WEIGHTS_V1,
  baseScore: 1000,
  costScale: 100,
  hotspotTopN: 10,
};

/** Default scoring config (latest stable version). */
export const DEFAULT_SCORING_CONFIG = SCORING_CONFIG_V1;

/** Resolve ergonomics config from a scoring config (convenience for E4). */
export function getErgonomicsFromScoringConfig(
  config: ScoringConfig = DEFAULT_SCORING_CONFIG,
): ErgonomicsConfig {
  return config.ergonomics;
}
