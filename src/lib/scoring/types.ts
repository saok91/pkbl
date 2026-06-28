import type { Finger } from "@/lib/ergonomics/types";
import type { Layer } from "@/lib/layout/types";

/** Resolved physical key for a typed character. */
export type CharResolution = {
  readonly keyId: string;
  readonly layer: Layer;
};

export type ScoreHotspot = {
  readonly char: string;
  readonly cost: number;
  readonly keyId: string;
};

export type ScoreBreakdown = {
  /** Raw accumulated unigram cost (lower is better). */
  readonly unigramCost: number;
  /** Raw accumulated bigram transition cost (lower is better). */
  readonly bigramCost: number;
  /** Raw accumulated trigram transition cost (lower is better). */
  readonly trigramCost: number;
  /** Normalized score contribution from unigrams — higher is better. */
  readonly unigramScore: number;
  /** Normalized score contribution from bigrams — higher is better. */
  readonly bigramScore: number;
  /** Normalized score contribution from trigrams — higher is better. */
  readonly trigramScore: number;
  /** Weighted home-row usage as percentage 0–100. */
  readonly homeRowUsage: number;
  /** Weighted finger load (normalized by sum of unigram weights, sums to ~1). */
  readonly fingerLoad: Readonly<Record<Finger, number>>;
  /** Hand balance 0–1 (1 = perfectly balanced). */
  readonly handBalance: number;
  /** Weighted count of same-finger bigram occurrences. */
  readonly sameFingerBigrams: number;
  /** Weighted count of same-hand bigram occurrences. */
  readonly sameHandBigrams: number;
  /** Weighted count of hand-alternation bigram occurrences. */
  readonly handAlternation: number;
  /** Weighted row-switch count from bigram loop only. */
  readonly bigramRowSwitching: number;
  /** Weighted row-switch count from trigram loop only. */
  readonly trigramRowSwitching: number;
  /** Sum of bigram + trigram row switches (convenience for UI). */
  readonly rowSwitching: number;
  /** Weighted aggregate weak-key penalty. */
  readonly weakKeyPenalty: number;
};

export type ScoreResult = {
  /** Overall score — higher is better. */
  readonly total: number;
  readonly breakdown: ScoreBreakdown;
  readonly hotspots: readonly ScoreHotspot[];
  readonly scorerVersion: string;
};
