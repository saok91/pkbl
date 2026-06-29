"use client";

import { useEffect, useRef } from "react";

import type { VerdictResult } from "@/lib/scoring/insights";

import { formatScore } from "../format-analytics";
import { BaselineCompare } from "./baseline-compare";
import { ScoreDeltaBadge } from "./score-delta-badge";

const BAND_TEXT_CLASS: Record<VerdictResult["band"], string> = {
  poor: "text-destructive",
  ok: "text-accent",
  good: "text-primary",
};

const BAND_BAR_CLASS: Record<VerdictResult["band"], string> = {
  poor: "bg-destructive",
  ok: "bg-accent",
  good: "bg-primary",
};

type VerdictGaugeProps = {
  verdict: VerdictResult;
  isStale: boolean;
  scoreDelta?: number | null;
  showScoreDelta?: boolean;
};

export function VerdictGauge({
  verdict,
  isStale,
  scoreDelta = null,
  showScoreDelta = false,
}: VerdictGaugeProps) {
  const previousBandRef = useRef(verdict.band);
  const liveRegionRef = useRef<HTMLParagraphElement>(null);
  const announcedInitialRef = useRef(false);

  useEffect(() => {
    if (!announcedInitialRef.current) {
      announcedInitialRef.current = true;
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = verdict.labelFa;
      }
      previousBandRef.current = verdict.band;
      return;
    }

    if (previousBandRef.current !== verdict.band) {
      previousBandRef.current = verdict.band;
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = verdict.labelFa;
      }
    }
  }, [verdict.band, verdict.labelFa]);

  const scoreMin = 380;
  const scoreMax = 740;
  const scoreRange = scoreMax - scoreMin;
  const pct = Math.min(
    100,
    Math.max(0, ((verdict.total - scoreMin) / scoreRange) * 100),
  );
  const basePct = Math.min(
    100,
    Math.max(0, ((verdict.baselineTotal - scoreMin) / scoreRange) * 100),
  );

  return (
    <div
      className={`rounded-xl border border-border-strong bg-surface-panel p-4 ${
        isStale ? "opacity-60 transition-opacity" : "opacity-100 transition-opacity"
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div
            className={`text-base font-semibold ${BAND_TEXT_CLASS[verdict.band]}`}
          >
            {verdict.labelFa}
          </div>
          <div
            className="mt-0.5 font-mono text-3xl font-bold tracking-tight tabular-nums"
          >
            {formatScore(verdict.total)}
            {isStale ? (
              <span className="mr-2 text-[10px] font-normal text-text-faint">
                در حال به‌روزرسانی…
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-text-faint tabular-nums">
            امتیاز: {formatScore(verdict.total)}
          </p>
        </div>
        <ScoreDeltaBadge delta={scoreDelta} visible={showScoreDelta && !isStale} />
      </div>

      <div
        className="relative h-1.5 overflow-hidden rounded-full bg-[#0A1525]"
        role="img"
        aria-label={`وضعیت چیدمان: ${verdict.labelFa}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${BAND_BAR_CLASS[verdict.band]}`}
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-0 h-full w-px bg-[#4A6080]/60"
          style={{ left: `${basePct}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="mt-1 flex justify-between font-mono text-[9px] text-text-faint">
        <span>{formatScore(scoreMin)}</span>
        <span className="text-text-dim">
          مبنا: {formatScore(verdict.baselineTotal)}
        </span>
        <span>{formatScore(scoreMax)}</span>
      </div>

      <p
        ref={liveRegionRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      <BaselineCompare
        total={verdict.total}
        baselineTotal={verdict.baselineTotal}
        isStale={isStale}
      />
    </div>
  );
}
