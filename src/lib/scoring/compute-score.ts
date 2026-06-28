import { getKeyMetrics } from "@/lib/ergonomics/metrics";
import type { Finger, KeyMetrics } from "@/lib/ergonomics/types";
import type { NgramStats } from "@/lib/corpus/types";
import type { Layout } from "@/lib/layout/types";
import { buildCharLookup, resolveChar } from "./char-lookup";
import {
  DEFAULT_SCORING_CONFIG,
  type ScoringConfig,
  type ScoringWeights,
} from "./config";
import type {
  CharResolution,
  ScoreBreakdown,
  ScoreHotspot,
  ScoreResult,
} from "./types";

const FINGERS: readonly Finger[] = [
  "thumb",
  "index",
  "middle",
  "ring",
  "pinky",
];

type ResolvedKey = {
  readonly resolution: CharResolution;
  readonly metrics: KeyMetrics;
};

type Accumulator = {
  unigramCost: number;
  bigramCost: number;
  trigramCost: number;
  sameFingerBigrams: number;
  sameHandBigrams: number;
  handAlternation: number;
  bigramRowSwitching: number;
  trigramRowSwitching: number;
  weakKeyPenalty: number;
  homeRowWeight: number;
  leftHandWeight: number;
  rightHandWeight: number;
  fingerLoad: Record<Finger, number>;
  charCosts: Map<string, { cost: number; keyId: string }>;
};

function createAccumulator(): Accumulator {
  return {
    unigramCost: 0,
    bigramCost: 0,
    trigramCost: 0,
    sameFingerBigrams: 0,
    sameHandBigrams: 0,
    handAlternation: 0,
    bigramRowSwitching: 0,
    trigramRowSwitching: 0,
    weakKeyPenalty: 0,
    homeRowWeight: 0,
    leftHandWeight: 0,
    rightHandWeight: 0,
    fingerLoad: {
      thumb: 0,
      index: 0,
      middle: 0,
      ring: 0,
      pinky: 0,
    },
    charCosts: new Map(),
  };
}

function resolveKey(
  lookup: ReadonlyMap<string, CharResolution>,
  char: string,
  config: ScoringConfig,
): ResolvedKey | null {
  const resolution = resolveChar(lookup, char);
  if (!resolution) {
    return null;
  }
  return {
    resolution,
    metrics: getKeyMetrics(resolution.keyId, config.ergonomics),
  };
}

function missingKeyMetrics(): KeyMetrics {
  return {
    finger: "pinky",
    hand: "left",
    row: "number",
    reachPenalty: 1,
    weakKeyPenalty: 1,
  };
}

function resolveKeyOrMissing(
  lookup: ReadonlyMap<string, CharResolution>,
  char: string,
  config: ScoringConfig,
): ResolvedKey {
  return (
    resolveKey(lookup, char, config) ?? {
      resolution: { keyId: "__missing__", layer: "base" },
      metrics: missingKeyMetrics(),
    }
  );
}

function getKeyUnitCost(metrics: KeyMetrics): number {
  return metrics.reachPenalty + metrics.weakKeyPenalty;
}

function addUnigramContribution(
  acc: Accumulator,
  char: string,
  freq: number,
  resolved: ResolvedKey,
  weights: ScoringWeights,
): void {
  const unitCost =
    resolved.resolution.keyId === "__missing__"
      ? weights.missingCharPenalty
      : getKeyUnitCost(resolved.metrics);
  const cost = freq * unitCost;

  acc.unigramCost += cost;
  if (resolved.resolution.keyId !== "__missing__") {
    acc.weakKeyPenalty += freq * resolved.metrics.weakKeyPenalty;
  }

  if (resolved.metrics.row === "home") {
    acc.homeRowWeight += freq;
  }

  acc.fingerLoad[resolved.metrics.finger] += freq;
  if (resolved.metrics.hand === "left") {
    acc.leftHandWeight += freq;
  } else {
    acc.rightHandWeight += freq;
  }

  const existing = acc.charCosts.get(char);
  if (!existing || cost > existing.cost) {
    acc.charCosts.set(char, {
      cost,
      keyId: resolved.resolution.keyId,
    });
  }
}

function bigramTransitionCost(
  from: ResolvedKey,
  to: ResolvedKey,
  weights: ScoringWeights,
): { cost: number; sameFinger: number; sameHand: number; alternation: number; rowSwitch: number } {
  const fromMetrics = from.metrics;
  const toMetrics = to.metrics;

  let cost = 0;
  let sameFinger = 0;
  let sameHand = 0;
  let alternation = 0;
  let rowSwitch = 0;

  if (fromMetrics.finger === toMetrics.finger && fromMetrics.hand === toMetrics.hand) {
    cost += weights.sameFingerBigram;
    sameFinger = 1;
  } else if (fromMetrics.hand === toMetrics.hand) {
    cost += weights.sameHandBigram;
    sameHand = 1;
  } else {
    cost -= weights.handAlternationBonus;
    alternation = 1;
  }

  if (fromMetrics.row !== toMetrics.row) {
    cost += weights.rowSwitch;
    rowSwitch = 1;
  }

  return { cost, sameFinger, sameHand, alternation, rowSwitch };
}

function addBigramContribution(
  acc: Accumulator,
  freq: number,
  from: ResolvedKey,
  to: ResolvedKey,
  weights: ScoringWeights,
): void {
  const transition = bigramTransitionCost(from, to, weights);
  acc.bigramCost += freq * transition.cost;
  acc.sameFingerBigrams += freq * transition.sameFinger;
  acc.sameHandBigrams += freq * transition.sameHand;
  acc.handAlternation += freq * transition.alternation;
  acc.bigramRowSwitching += freq * transition.rowSwitch;
}

function addTrigramContribution(
  acc: Accumulator,
  freq: number,
  first: ResolvedKey,
  second: ResolvedKey,
  third: ResolvedKey,
  weights: ScoringWeights,
): void {
  const ab = bigramTransitionCost(first, second, weights);
  const bc = bigramTransitionCost(second, third, weights);
  acc.trigramCost += freq * (ab.cost + bc.cost);
  acc.trigramRowSwitching += freq * (ab.rowSwitch + bc.rowSwitch);
}

function buildHotspots(
  charCosts: ReadonlyMap<string, { cost: number; keyId: string }>,
  topN: number,
): readonly ScoreHotspot[] {
  return [...charCosts.entries()]
    .map(([char, entry]) => ({
      char,
      cost: entry.cost,
      keyId: entry.keyId,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, topN);
}

function computeHandBalance(leftWeight: number, rightWeight: number): number {
  const total = leftWeight + rightWeight;
  if (total <= 0) {
    return 1;
  }
  const leftRatio = leftWeight / total;
  return Math.max(0, 1 - Math.abs(leftRatio - 0.5) * 2);
}

function sumFingerLoad(fingerLoad: Record<Finger, number>): number {
  return FINGERS.reduce((sum, finger) => sum + fingerLoad[finger], 0);
}

function normalizeFingerLoad(
  fingerLoad: Record<Finger, number>,
  totalWeight: number,
): Readonly<Record<Finger, number>> {
  if (totalWeight <= 0) {
    return { ...fingerLoad };
  }
  return Object.fromEntries(
    FINGERS.map((finger) => [finger, fingerLoad[finger] / totalWeight]),
  ) as Record<Finger, number>;
}

function toScoreComponent(rawCost: number, weight: number, norm: number, costScale: number): number {
  return -((rawCost * weight) / norm) * costScale;
}

function buildBreakdown(
  acc: Accumulator,
  totalChars: number,
  config: ScoringConfig,
): ScoreBreakdown {
  const norm = Math.max(1, totalChars);
  const { weights, costScale } = config;

  const unigramScore = toScoreComponent(acc.unigramCost, weights.unigram, norm, costScale);
  const bigramScore = toScoreComponent(acc.bigramCost, weights.bigram, norm, costScale);
  const trigramScore = toScoreComponent(acc.trigramCost, weights.trigram, norm, costScale);

  const homeRowUsage =
    totalChars > 0 ? (acc.homeRowWeight / totalChars) * 100 : 0;

  const unigramWeight = sumFingerLoad(acc.fingerLoad);

  return {
    unigramCost: acc.unigramCost,
    bigramCost: acc.bigramCost,
    trigramCost: acc.trigramCost,
    unigramScore,
    bigramScore,
    trigramScore,
    homeRowUsage,
    fingerLoad: normalizeFingerLoad(acc.fingerLoad, unigramWeight),
    handBalance: computeHandBalance(acc.leftHandWeight, acc.rightHandWeight),
    sameFingerBigrams: acc.sameFingerBigrams,
    sameHandBigrams: acc.sameHandBigrams,
    handAlternation: acc.handAlternation,
    bigramRowSwitching: acc.bigramRowSwitching,
    trigramRowSwitching: acc.trigramRowSwitching,
    rowSwitching: acc.bigramRowSwitching + acc.trigramRowSwitching,
    weakKeyPenalty: acc.weakKeyPenalty,
  };
}

/**
 * Deterministic layout scorer (E4).
 * Higher total score = better layout for the given corpus.
 */
export function computeScore(
  layout: Layout,
  ngramStats: NgramStats,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG,
): ScoreResult {
  const lookup = buildCharLookup(layout);
  const acc = createAccumulator();
  const { weights } = config;

  for (const [char, freq] of ngramStats.unigrams) {
    const resolved = resolveKeyOrMissing(lookup, char, config);
    addUnigramContribution(acc, char, freq, resolved, weights);
  }

  for (const [bigram, freq] of ngramStats.bigrams) {
    const chars = [...bigram];
    if (chars.length !== 2) {
      continue;
    }
    const from = resolveKeyOrMissing(lookup, chars[0]!, config);
    const to = resolveKeyOrMissing(lookup, chars[1]!, config);
    addBigramContribution(acc, freq, from, to, weights);
  }

  for (const [trigram, freq] of ngramStats.trigrams) {
    const chars = [...trigram];
    if (chars.length !== 3) {
      continue;
    }
    const first = resolveKeyOrMissing(lookup, chars[0]!, config);
    const second = resolveKeyOrMissing(lookup, chars[1]!, config);
    const third = resolveKeyOrMissing(lookup, chars[2]!, config);
    addTrigramContribution(acc, freq, first, second, third, weights);
  }

  const breakdown = buildBreakdown(acc, ngramStats.totalChars, config);
  const total =
    config.baseScore +
    breakdown.unigramScore +
    breakdown.bigramScore +
    breakdown.trigramScore;

  return {
    total,
    breakdown,
    hotspots: buildHotspots(acc.charCosts, config.hotspotTopN),
    scorerVersion: config.scorerVersion,
  };
}
