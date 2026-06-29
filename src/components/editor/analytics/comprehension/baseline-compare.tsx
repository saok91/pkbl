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
  const deltaText =
    delta.percent === 0
      ? "برابر با چیدمان پیش‌فرض"
      : isBetter
        ? `${formatDeltaPercent(delta.percent)} بهتر از چیدمان پیش‌فرض`
        : `${formatDeltaPercent(Math.abs(delta.percent))} بدتر از چیدمان پیش‌فرض`;

  const userBarWidth =
    baselineTotal > 0
      ? Math.min(100, Math.round((total / baselineTotal) * 50))
      : 50;
  const baselineBarWidth = 50;

  return (
    <div
      className={
        isStale
          ? "mt-2 space-y-2 opacity-60 transition-opacity"
          : "mt-2 space-y-2 opacity-100 transition-opacity"
      }
    >
      <p
        className={`text-sm font-medium tabular-nums ${
          isBetter ? "text-emerald-400" : "text-amber-400"
        }`}
      >
        {deltaText}
      </p>

      <div
        role="img"
        aria-label={`امتیاز شما ${formatScore(total)} در مقابل پیش‌فرض ${formatScore(baselineTotal)}`}
        className="space-y-1.5"
      >
        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-[11px] text-slate-500">شما</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${
                isBetter ? "bg-emerald-500/80" : "bg-amber-500/80"
              }`}
              style={{ width: `${userBarWidth}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-[11px] text-slate-500">
            پیش‌فرض
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-slate-600 transition-all"
              style={{ width: `${baselineBarWidth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
