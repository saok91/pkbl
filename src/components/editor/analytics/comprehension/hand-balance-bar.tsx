import { classifyMetric, ERGONOMIC_METRIC_BANDS } from "@/lib/scoring/insights";

import { HAND_LABEL_FA } from "../analytics-labels";
import { formatPercent } from "../format-analytics";
import { METRIC_QUALITY_LABEL_FA } from "./comprehension-labels";
import { findGlossaryEntry } from "./metric-glossary";
import { MetricInfo } from "./metric-info";
import { COMPREHENSION_SECTION_FA } from "./comprehension-labels";

type HandBalanceBarProps = {
  handBalance: number;
  leftHandShare: number;
  rightHandShare: number;
};

export function HandBalanceBar({
  handBalance,
  leftHandShare,
  rightHandShare,
}: HandBalanceBarProps) {
  const quality = classifyMetric(
    handBalance,
    ERGONOMIC_METRIC_BANDS.handBalance,
  );
  const glossaryEntry = findGlossaryEntry("تعادل دست");

  const leftPercent = Math.round(leftHandShare * 100);
  const rightPercent = Math.round(rightHandShare * 100);
  const barWidth = Math.round(handBalance * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <h3 className="text-[11px] text-text-dim">
          {COMPREHENSION_SECTION_FA.handBalance}
        </h3>
        {glossaryEntry ? <MetricInfo entry={glossaryEntry} /> : null}
        <span className="text-xs text-text-faint">
          ({METRIC_QUALITY_LABEL_FA[quality]})
        </span>
      </div>

      <div
        role="img"
        aria-label={`تعادل دست: ${METRIC_QUALITY_LABEL_FA[quality]} — ${HAND_LABEL_FA.left} ${formatPercent(leftPercent)}، ${HAND_LABEL_FA.right} ${formatPercent(rightPercent)}`}
        className="space-y-1"
      >
        <div className="relative h-3 overflow-hidden rounded-full bg-[#0A1525]">
          <div
            className="absolute inset-y-0 rounded-full bg-primary/60 transition-all"
            style={{
              insetInlineStart: `${50 - barWidth / 2}%`,
              width: `${barWidth}%`,
            }}
          />
          <div
            className="absolute inset-y-0 w-px bg-border-strong"
            style={{ insetInlineStart: "50%" }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-text-faint">
          <span>
            {HAND_LABEL_FA.left} {formatPercent(leftPercent)}
          </span>
          <span>
            {HAND_LABEL_FA.right} {formatPercent(rightPercent)}
          </span>
        </div>
      </div>
    </div>
  );
}
