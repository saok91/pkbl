/** Qualitative band for a metric or overall verdict. */
export type MetricQuality = "good" | "ok" | "poor";

export type VerdictBand = MetricQuality;

export type InsightKind = "strength" | "weakness";

export type InsightMetric =
  | "homeRowUsage"
  | "handBalance"
  | "sameFingerBigrams"
  | "weakKeyPenalty"
  | "rowSwitching";

export type Insight = {
  readonly kind: InsightKind;
  readonly metric: InsightMetric;
  readonly severity: number;
  readonly titleFa: string;
  readonly adviceFa: string;
};

export type VerdictResult = {
  readonly band: VerdictBand;
  readonly labelFa: string;
  readonly total: number;
  readonly baselineTotal: number;
  readonly ratioToBaseline: number;
};

export type BaselineDelta = {
  readonly absolute: number;
  readonly percent: number;
};

/** Context for deriving insights — baseline score + layout completeness (E15-S2). */
export type InsightsBaseline = {
  readonly baselineTotal: number;
  readonly incomplete?: boolean;
};

export type MetricBandConfig = {
  readonly good: number;
  readonly ok: number;
  readonly direction: "higher" | "lower";
};
