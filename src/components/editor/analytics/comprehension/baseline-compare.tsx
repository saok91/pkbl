"use client";

import { computeBaselineDelta } from "@/lib/scoring/insights";

import { formatDeltaPercent, formatScore } from "../format-analytics";

type BaselineCompareProps = {
  total: number;
  baselineTotal: number;
  isStale: boolean;
};

export function BaselineCompare({
  total,
  baselineTotal,
  isStale,
}: BaselineCompareProps) {
  const delta = computeBaselineDelta(total, baselineTotal);
  const isBetter = delta.percent >= 0;
  const deltaPct = Math.round(delta.percent);
  const deltaText =
    delta.percent === 0
      ? "برابر با چیدمان پیش‌فرض"
      : isBetter
        ? `${formatDeltaPercent(delta.percent)} بهتر از چیدمان پیش‌فرض`
        : `${formatDeltaPercent(Math.abs(delta.percent))} بدتر از چیدمان پیش‌فرض`;
  const max = Math.max(total, baselineTotal) * 1.05;

  return (
    <div
      className={
        isStale
          ? "mt-3 space-y-2 opacity-60 transition-opacity"
          : "mt-3 space-y-2 opacity-100 transition-opacity"
      }
    >
      <div className="mb-2 flex items-center justify-between text-[11px] text-text-dim">
        <span>مقایسه با پیش‌فرض</span>
        <span
          className={`font-mono font-semibold tabular-nums ${
            isBetter ? "text-primary" : "text-destructive"
          }`}
        >
          {isBetter ? "+" : ""}
          {formatDeltaPercent(deltaPct)}٪
        </span>
      </div>

      <p className="sr-only">{deltaText}</p>

      <div
        role="img"
        aria-label={`امتیاز شما ${formatScore(total)} در مقابل پیش‌فرض ${formatScore(baselineTotal)}`}
      >
        {[
          { label: "شما", val: total, color: "bg-primary" },
          { label: "پیش‌فرض", val: baselineTotal, color: "bg-text-faint" },
        ].map((bar) => (
          <div key={bar.label} className="mb-1.5 flex items-center gap-2">
            <span className="w-14 shrink-0 text-left text-[10px] text-text-faint">
              {bar.label}
            </span>
            <div className="h-5 flex-1 overflow-hidden rounded bg-[#0A1525]">
              <div
                className={`flex h-full items-center rounded transition-all duration-700 ${bar.color}`}
                style={{ width: `${(bar.val / max) * 100}%` }}
              >
                <span className="px-1.5 font-mono text-[10px] font-bold text-black/80 tabular-nums">
                  {formatScore(bar.val)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
