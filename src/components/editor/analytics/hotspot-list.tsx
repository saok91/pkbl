"use client";

import { useState } from "react";

import { getCharDisplayLabel } from "@/lib/layout/charset-labels";
import type { Layout } from "@/lib/layout/types";
import type { ScoreHotspot } from "@/lib/scoring/types";

import { ANALYTICS_PANEL_SECTION_FA } from "./analytics-labels";
import { formatCost } from "./format-analytics";

const HOTSPOT_LIST_ID = "hotspot-list-items";
const PANEL_HOTSPOT_COUNT = 5;
const FULL_HOTSPOT_COUNT = 10;

type HotspotListProps = {
  hotspots: readonly ScoreHotspot[];
  layout: Layout;
  onHotspotSelect: (keyId: string) => void;
};

function getKeyName(layout: Layout, keyId: string): string {
  if (keyId === "__missing__") {
    return "بدون کلید";
  }
  const key = layout.keys.get(keyId);
  if (!key) {
    return keyId;
  }
  if (key.modifierLabel) {
    return key.modifierLabel;
  }
  const baseLabel = key.defaultLabel.split("\n").pop() ?? key.defaultLabel;
  return baseLabel ? getCharDisplayLabel(baseLabel) : keyId;
}

export function HotspotList({
  hotspots,
  layout,
  onHotspotSelect,
}: HotspotListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = expanded ? FULL_HOTSPOT_COUNT : PANEL_HOTSPOT_COUNT;
  const visibleHotspots = hotspots.slice(0, visibleCount);
  const hasMore = hotspots.length > PANEL_HOTSPOT_COUNT;

  if (hotspots.length === 0) {
    return <p className="text-sm text-slate-500">نقطه پرهزینه‌ای یافت نشد.</p>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium tracking-wide text-slate-400 uppercase">
        {ANALYTICS_PANEL_SECTION_FA.hotspots}
      </h3>
      <ul id={HOTSPOT_LIST_ID} className="space-y-1">
        {visibleHotspots.map((hotspot) => (
          <li key={`${hotspot.char}-${hotspot.keyId}`}>
            <button
              type="button"
              onClick={() => onHotspotSelect(hotspot.keyId)}
              className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-slate-200 transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              <span className="truncate">
                <span className="font-medium">
                  {getCharDisplayLabel(hotspot.char)}
                </span>
                <span className="mx-1.5 text-slate-600">·</span>
                <span className="text-slate-400 tabular-nums">
                  {formatCost(hotspot.cost)}
                </span>
              </span>
              <span className="shrink-0 text-xs text-slate-500">
                {getKeyName(layout, hotspot.keyId)}
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
          className="text-xs text-sky-400 hover:text-sky-300 focus-visible:underline focus-visible:outline-none"
        >
          {expanded ? "نمایش کمتر" : "نمایش همه"}
        </button>
      ) : null}
    </div>
  );
}
