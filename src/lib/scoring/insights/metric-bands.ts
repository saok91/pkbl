import { RANKING_HINT_THRESHOLDS } from "./thresholds";

import type { MetricBandConfig, MetricQuality } from "./types";

/** Versioned metric band constants — tune after corpus calibration. */
export const METRIC_BANDS_VERSION = "1" as const;

const t = RANKING_HINT_THRESHOLDS;

/** Ergonomic metrics mapped to good/ok thresholds (E15-S2, E15-S5). */
export const ERGONOMIC_METRIC_BANDS = {
  homeRowUsage: {
    direction: "higher",
    good: t.homeRowUsageMin + 10,
    ok: t.homeRowUsageMin,
  },
  handBalance: {
    direction: "higher",
    good: 0.92,
    ok: t.handBalanceMin,
  },
  sameFingerBigrams: {
    direction: "lower",
    good: Math.round(t.sameFingerBigrams * 0.6),
    ok: t.sameFingerBigrams,
  },
  weakKeyPenalty: {
    direction: "lower",
    good: Math.round(t.weakKeyPenalty * 0.65),
    ok: t.weakKeyPenalty,
  },
  rowSwitching: {
    direction: "lower",
    good: Math.round(t.rowSwitching * 0.7),
    ok: t.rowSwitching,
  },
} as const satisfies Record<string, MetricBandConfig>;

/** Finger load thresholds as fraction of total load (E15-S5). */
export const FINGER_LOAD_BANDS = {
  default: { good: 0.22, ok: 0.28 },
  pinky: { good: 0.15, ok: 0.2 },
} as const;

/** Verdict bands relative to baseline total (E15-S1). */
export const VERDICT_BANDS_V1 = {
  version: METRIC_BANDS_VERSION,
  /** Ratio >= goodMinRatio → «چیدمان خوب». */
  goodMinRatio: 1.03,
  /** Ratio >= okMinRatio → «قابل‌قبول»; below → «نیازمند بهبود». */
  okMinRatio: 0.92,
} as const;

export function classifyMetric(
  value: number,
  band: MetricBandConfig,
): MetricQuality {
  if (band.direction === "higher") {
    if (value >= band.good) {
      return "good";
    }
    if (value >= band.ok) {
      return "ok";
    }
    return "poor";
  }

  if (value <= band.good) {
    return "good";
  }
  if (value <= band.ok) {
    return "ok";
  }
  return "poor";
}

export function metricSeverity(
  value: number,
  band: MetricBandConfig,
): number {
  if (band.direction === "higher") {
    if (value >= band.good) {
      return value - band.good;
    }
    if (value < band.ok) {
      return band.ok - value;
    }
    return 0;
  }

  if (value <= band.good) {
    return band.good - value;
  }
  if (value > band.ok) {
    return value - band.ok;
  }
  return 0;
}

export function classifyFingerLoad(
  load: number,
  finger: "pinky" | "default",
): MetricQuality {
  const bands =
    finger === "pinky" ? FINGER_LOAD_BANDS.pinky : FINGER_LOAD_BANDS.default;
  if (load <= bands.good) {
    return "good";
  }
  if (load <= bands.ok) {
    return "ok";
  }
  return "poor";
}
