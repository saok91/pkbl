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
    return <p className="text-sm text-text-dim">نقطه پرهزینه‌ای یافت نشد.</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <h3 className="text-[11px] text-text-dim">نقاط پرهزینه</h3>
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
              className="group flex w-full items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-[#112040] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <span className="w-3 shrink-0 font-mono text-[9px] text-text-faint">
                {formatScore(index + 1)}
              </span>
              <span className="w-5 text-center text-[15px] text-text-secondary">
                {getCharDisplayLabel(hotspot.char)}
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-keyboard">
                <div
                  className="h-full rounded-full bg-accent/60"
                  style={{ width: `${(hotspot.cost / maxCost) * 100}%` }}
                />
              </div>
              <span className="shrink-0 font-mono text-[9px] text-text-faint group-hover:text-accent">
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
          className="flex items-center gap-1 text-[11px] text-text-faint transition-colors hover:text-primary focus-visible:underline focus-visible:outline-none"
        >
          {expanded
            ? "کمتر"
            : `${formatScore(hotspots.length - PANEL_HOTSPOT_COUNT)} مورد دیگر`}
        </button>
      ) : null}
    </div>
  );
}
