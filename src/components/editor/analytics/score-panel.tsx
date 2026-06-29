"use client";

import type { Layout } from "@/lib/layout/types";

import { BreakdownAccordion } from "./breakdown-accordion";
import { HotspotList } from "./hotspot-list";
import { RankingHint } from "./ranking-hint";
import { deriveRankingHint } from "./ranking-hints";
import { ScoreHero } from "./score-hero";
import type { LiveScoreState } from "./use-live-score";

type ScorePanelProps = {
  layout: Layout;
  liveScore: LiveScoreState;
  onHotspotSelect: (keyId: string) => void;
};

export function ScorePanel({
  layout,
  liveScore,
  onHotspotSelect,
}: ScorePanelProps) {
  const { result, isStale, error, presetId, setPresetId } = liveScore;
  const hint =
    result !== null
      ? deriveRankingHint({ layout, breakdown: result.breakdown })
      : null;

  return (
    <aside
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"
      aria-label="پنل امتیازدهی"
    >
      <ScoreHero
        total={result?.total ?? null}
        presetId={presetId}
        isStale={isStale}
        onPresetChange={setPresetId}
      />

      {error ? (
        <p className="mt-3 text-sm text-amber-300" role="alert">
          {error}
        </p>
      ) : null}

      {hint ? (
        <div className="mt-3 border-t border-slate-800 pt-3">
          <RankingHint hint={hint} />
        </div>
      ) : null}

      {result ? (
        <>
          <div className="mt-4 border-t border-slate-800 pt-4">
            <HotspotList
              hotspots={result.hotspots}
              layout={layout}
              onHotspotSelect={onHotspotSelect}
            />
          </div>
          <div className="mt-4 border-t border-slate-800 pt-4">
            <BreakdownAccordion breakdown={result.breakdown} />
          </div>
        </>
      ) : null}
    </aside>
  );
}
