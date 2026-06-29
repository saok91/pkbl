import type { Finger } from "@/lib/ergonomics/types";

import { FINGER_LABEL_FA, FINGER_LOAD_CAPTION_FA } from "./analytics-labels";
import { formatPercent } from "./format-analytics";

const FINGER_ORDER: readonly Finger[] = [
  "index",
  "middle",
  "ring",
  "pinky",
  "thumb",
];

type FingerLoadBarsProps = {
  fingerLoad: Readonly<Record<Finger, number>>;
};

export function FingerLoadBars({ fingerLoad }: FingerLoadBarsProps) {
  const maxLoad = Math.max(
    ...FINGER_ORDER.map((finger) => fingerLoad[finger]),
    0.01,
  );

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-text-faint">{FINGER_LOAD_CAPTION_FA}</p>
      {FINGER_ORDER.map((finger) => {
        const load = fingerLoad[finger];
        const widthPercent = Math.round((load / maxLoad) * 100);
        return (
          <div key={finger} className="space-y-1">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-text-dim">{FINGER_LABEL_FA[finger]}</span>
              <span className="text-text-secondary tabular-nums">
                {formatPercent(load * 100)}
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-[#0A1525]"
              role="presentation"
            >
              <div
                className="h-full rounded-full bg-primary/80 transition-all"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
