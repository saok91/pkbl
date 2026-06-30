import type { Finger } from "@/lib/ergonomics/types";
import { classifyFingerLoad, type MetricQuality } from "@/lib/scoring/insights";

import { FINGER_LABEL_FA } from "../analytics-labels";
import { formatPercent } from "../format-analytics";
import { METRIC_QUALITY_LABEL_FA } from "./comprehension-labels";
import { findGlossaryEntry } from "./metric-glossary";
import { MetricInfo } from "./metric-info";
import { COMPREHENSION_SECTION_FA } from "./comprehension-labels";

const FINGER_ORDER: readonly Finger[] = [
  "index",
  "middle",
  "ring",
  "pinky",
  "thumb",
];

const BAR_COLOR: Record<MetricQuality, string> = {
  good: "bg-primary/80",
  ok: "bg-accent/80",
  poor: "bg-destructive/80",
};

type FingerLoadChartProps = {
  fingerLoad: Readonly<Record<Finger, number>>;
};

export function FingerLoadChart({ fingerLoad }: FingerLoadChartProps) {
  const glossaryEntry = findGlossaryEntry("بار انگشت");
  const maxLoad = Math.max(
    ...FINGER_ORDER.map((finger) => fingerLoad[finger]),
    0.01,
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <h3 className="text-text-dim text-[11px]">
          {COMPREHENSION_SECTION_FA.fingerLoad}
        </h3>
        {glossaryEntry ? <MetricInfo entry={glossaryEntry} /> : null}
      </div>

      <div
        role="img"
        aria-label="نمودار بار انگشتان — سبز متعادل، قرمز بیش‌بار"
        className="space-y-2"
      >
        {FINGER_ORDER.map((finger) => {
          const load = fingerLoad[finger];
          const quality = classifyFingerLoad(
            load,
            finger === "pinky" ? "pinky" : "default",
          );
          const widthPercent = Math.round((load / maxLoad) * 100);

          return (
            <div key={finger} className="space-y-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-text-dim">
                  {FINGER_LABEL_FA[finger]}
                  <span className="text-text-faint ms-1.5">
                    ({METRIC_QUALITY_LABEL_FA[quality]})
                  </span>
                </span>
                <span className="text-text-secondary tabular-nums">
                  {formatPercent(load * 100)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#0A1525]">
                <div
                  className={`h-full rounded-full transition-all ${BAR_COLOR[quality]}`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
