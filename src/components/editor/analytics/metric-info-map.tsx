import type { ReactNode } from "react";

import { BREAKDOWN_FIELD_FA } from "./analytics-labels";
import { findGlossaryEntry } from "./comprehension/metric-glossary";
import { MetricInfo } from "./comprehension/metric-info";

export function metricInfoForField(
  field: keyof typeof BREAKDOWN_FIELD_FA,
): ReactNode {
  const entry = findGlossaryEntry(BREAKDOWN_FIELD_FA[field]);
  if (!entry) {
    return null;
  }
  return <MetricInfo entry={entry} />;
}
