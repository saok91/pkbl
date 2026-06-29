"use client";

import { useEffect, useRef, useState } from "react";

import type { VerdictResult } from "@/lib/scoring/insights";

import { formatScore } from "../format-analytics";
import { BaselineCompare } from "./baseline-compare";
import { ScoreDeltaBadge } from "./score-delta-badge";

const BAND_SEGMENT_CLASS: Record<VerdictResult["band"], string> = {
  poor: "bg-amber-500",
  ok: "bg-yellow-400",
  good: "bg-emerald-500",
};

const BAND_TEXT_CLASS: Record<VerdictResult["band"], string> = {
  poor: "text-amber-300",
  ok: "text-yellow-300",
  good: "text-emerald-300",
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

  const activeIndex =
    verdict.band === "poor" ? 0 : verdict.band === "ok" ? 1 : 2;

  return (
    <div
      className={
        isStale
          ? "opacity-60 transition-opacity"
          : "opacity-100 transition-opacity"
      }
    >
      <div
        className="mb-3 flex gap-1"
        role="img"
        aria-label={`وضعیت چیدمان: ${verdict.labelFa}`}
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${
              index <= activeIndex
                ? BAND_SEGMENT_CLASS[
                    index === 0 ? "poor" : index === 1 ? "ok" : "good"
                  ]
                : "bg-slate-800"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <p className={`text-xl font-bold ${BAND_TEXT_CLASS[verdict.band]}`}>
          {verdict.labelFa}
        </p>
        <ScoreDeltaBadge delta={scoreDelta} visible={showScoreDelta} />
      </div>

      <p
        ref={liveRegionRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      <p className="mt-1 text-sm text-slate-500 tabular-nums">
        امتیاز: {formatScore(verdict.total)}
      </p>

      <BaselineCompare
        total={verdict.total}
        baselineTotal={verdict.baselineTotal}
        isStale={isStale}
      />
    </div>
  );
}
