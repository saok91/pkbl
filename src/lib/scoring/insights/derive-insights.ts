import type { ScoreBreakdown } from "@/lib/scoring/types";

import {
  classifyMetric,
  ERGONOMIC_METRIC_BANDS,
  metricSeverity,
} from "./metric-bands";
import type { Insight, InsightMetric, InsightsBaseline } from "./types";

type MetricCopy = {
  readonly strengthTitle: string;
  readonly strengthAdvice: string;
  readonly weaknessTitle: string;
  readonly weaknessAdvice: string;
};

const METRIC_COPY: Record<InsightMetric, MetricCopy> = {
  homeRowUsage: {
    strengthTitle: "استفاده خوب از ردیف home",
    strengthAdvice: "حروف پرتکرار در ردیف وسط قرار دارند — تایپ راحت‌تر است.",
    weaknessTitle: "استفاده کم از ردیف home",
    weaknessAdvice:
      "حروف پرتکرار را به ردیف وسط (جای انگشتان در حالت استراحت) منتقل کنید.",
  },
  handBalance: {
    strengthTitle: "تعادل خوب بین دو دست",
    strengthAdvice: "بار تایپ بین دست چپ و راست متعادل است.",
    weaknessTitle: "بار نامتوازن بین دو دست",
    weaknessAdvice:
      "برخی حروف پرتکرار را به دست دیگر منتقل کنید تا بار متعادل شود.",
  },
  sameFingerBigrams: {
    strengthTitle: "توالی‌های هم‌انگشتی کم",
    strengthAdvice: "حروف پشت‌سرهم معمولاً با انگشتان مختلف تایپ می‌شوند.",
    weaknessTitle: "توالی‌های هم‌انگشتی زیاد",
    weaknessAdvice:
      "حروف پرتکرار پشت‌سرهم را از هم جدا کنید تا با انگشتان مختلف تایپ شوند.",
  },
  weakKeyPenalty: {
    strengthTitle: "استفاده کم از کلیدهای دشوار",
    strengthAdvice: "حروف پرکاربرد روی جایگاه‌های راحت‌تر قرار دارند.",
    weaknessTitle: "بار زیاد روی کلیدهای دشوار",
    weaknessAdvice:
      "حروف پرتکرار را از گوشه‌ها و انگشت کوچک به جایگاه‌های مرکزی منتقل کنید.",
  },
  rowSwitching: {
    strengthTitle: "جابه‌جایی کم بین ردیف‌ها",
    strengthAdvice: "انگشتان کمتر بین ردیف‌های بالا و پایین حرکت می‌کنند.",
    weaknessTitle: "جابه‌جایی زیاد بین ردیف‌ها",
    weaknessAdvice:
      "حروف پرتکرار را در یک ردیف نگه دارید تا حرکت انگشت کمتر شود.",
  },
};

const INSIGHT_METRICS: readonly InsightMetric[] = [
  "homeRowUsage",
  "handBalance",
  "sameFingerBigrams",
  "weakKeyPenalty",
  "rowSwitching",
];

function getMetricValue(
  breakdown: ScoreBreakdown,
  metric: InsightMetric,
): number {
  return breakdown[metric];
}

const MAX_INSIGHTS_PER_KIND = 3;

export function deriveInsights(
  breakdown: ScoreBreakdown,
  baseline: InsightsBaseline,
): readonly Insight[] {
  if (baseline.incomplete) {
    return [];
  }

  const strengths: Insight[] = [];
  const weaknesses: Insight[] = [];

  for (const metric of INSIGHT_METRICS) {
    const band = ERGONOMIC_METRIC_BANDS[metric];
    const value = getMetricValue(breakdown, metric);
    const quality = classifyMetric(value, band);
    const copy = METRIC_COPY[metric];
    const severity = Math.abs(metricSeverity(value, band));

    if (quality === "good") {
      strengths.push({
        kind: "strength",
        metric,
        severity,
        titleFa: copy.strengthTitle,
        adviceFa: copy.strengthAdvice,
      });
    } else if (quality === "poor") {
      weaknesses.push({
        kind: "weakness",
        metric,
        severity,
        titleFa: copy.weaknessTitle,
        adviceFa: copy.weaknessAdvice,
      });
    }
  }

  const sortBySeverity = (a: Insight, b: Insight) => b.severity - a.severity;

  return [
    ...strengths.sort(sortBySeverity).slice(0, MAX_INSIGHTS_PER_KIND),
    ...weaknesses.sort(sortBySeverity).slice(0, MAX_INSIGHTS_PER_KIND),
  ];
}

export function partitionInsights(insights: readonly Insight[]): {
  readonly strengths: readonly Insight[];
  readonly weaknesses: readonly Insight[];
} {
  return {
    strengths: insights.filter((insight) => insight.kind === "strength"),
    weaknesses: insights.filter((insight) => insight.kind === "weakness"),
  };
}
