"use client";

import { useState } from "react";

import { getCharDisplayLabel } from "@/lib/layout/charset-labels";
import type { Layout } from "@/lib/layout/types";
import type { ScoreHotspot } from "@/lib/scoring/types";

import { formatCost, formatScore } from "./format-analytics";
import { findGlossaryEntry } from "./comprehension/metric-glossary";
import { MetricInfo } from "./comprehension/metric-info";

const HOTSPOT_LIST_ID = "hotspot-list-items";
const PANEL_HOTSPOT_COUNT = 5;
const FULL_HOTSPOT_COUNT = 10;

const HOTSPOT_PRIORITY_FA = ["بسیار پرهزینه", "پرهزینه", "متوسط"] as const;

type HotspotListProps = {
  hotspots: readonly ScoreHotspot[];
  layout: Layout;
  onHotspotSelect: (keyId: string) => void;
  variant?: "simple" | "expert";
};

function simpleHotspotLabel(index: number): string {
  return HOTSPOT_PRIORITY_FA[Math.min(index, HOTSPOT_PRIORITY_FA.length - 1)]!;
}

export function HotspotList({
  hotspots,
  onHotspotSelect,
  variant = "expert",
}: HotspotListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = expanded ? FULL_HOTSPOT_COUNT : PANEL_HOTSPOT_COUNT;
  const visibleHotspots = hotspots.slice(0, visibleCount);
  const hasMore = hotspots.length > PANEL_HOTSPOT_COUNT;
  const glossaryEntry = findGlossaryEntry("نقطه پرهزینه");
  const maxCost = hotspots[0]?.cost ?? 1;

  if (hotspots.length === 0) {
    return <p className="text-text-dim text-sm">نقطه پرهزینه‌ای یافت نشد.</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <h3 className="text-text-dim text-[11px]">نقاط پرهزینه</h3>
        {variant === "simple" && glossaryEntry ? (
          <MetricInfo entry={glossaryEntry} />
        ) : null}
      </div>
      <ul id={HOTSPOT_LIST_ID} className="space-y-0.5">
        {visibleHotspots.map((hotspot, index) => (
          <li key={`${hotspot.char}-${hotspot.keyId}`}>
            <button
              type="button"
              onClick={() => onHotspotSelect(hotspot.keyId)}
              className="group focus-visible:ring-primary flex w-full items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-[#112040] focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="text-text-faint w-3 shrink-0 font-mono text-[9px]">
                {formatScore(index + 1)}
              </span>
              <span className="text-text-secondary w-5 text-center text-[15px]">
                {getCharDisplayLabel(hotspot.char)}
              </span>
              <div className="bg-surface-keyboard h-1 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-accent/60 h-full rounded-full"
                  style={{ width: `${(hotspot.cost / maxCost) * 100}%` }}
                />
              </div>
              <span className="text-text-faint group-hover:text-accent shrink-0 font-mono text-[9px]">
                {variant === "simple"
                  ? simpleHotspotLabel(index)
                  : formatCost(hotspot.cost)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {hasMore ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={HOTSPOT_LIST_ID}
          onClick={() => setExpanded((value) => !value)}
          className="text-text-faint hover:text-primary flex items-center gap-1 text-[11px] transition-colors focus-visible:underline focus-visible:outline-none"
        >
          {expanded
            ? "کمتر"
            : `${formatScore(hotspots.length - PANEL_HOTSPOT_COUNT)} مورد دیگر`}
        </button>
      ) : null}
    </div>
  );
}
