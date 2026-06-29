"use client";

import { useMemo } from "react";

import type { Layout } from "@/lib/layout/types";
import {
  deriveInsights,
  deriveVerdict,
  getBaselineScore,
  partitionInsights,
} from "@/lib/scoring/insights";

import { BreakdownAccordion } from "./breakdown-accordion";
import { FingerLoadChart } from "./comprehension/finger-load-chart";
import { HandBalanceBar } from "./comprehension/hand-balance-bar";
import { MetricsHelp } from "./comprehension/metrics-help";
import { StrengthsWeaknesses } from "./comprehension/strengths-weaknesses";
import { VerdictGauge } from "./comprehension/verdict-gauge";
import {
  useAnalyticsViewMode,
  ViewModeToggle,
} from "./comprehension/view-mode-toggle";
import { HotspotList } from "./hotspot-list";
import { RankingHint } from "./ranking-hint";
import { deriveRankingHint, hasUnassignedEditableChars } from "./ranking-hints";
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
  const { result, ngramStats, isStale, error, presetId, setPresetId, scoreDelta, showScoreDelta } =
    liveScore;
  const { mode, setMode } = useAnalyticsViewMode();

  const incomplete = hasUnassignedEditableChars(layout);

  const hint =
    result !== null
      ? deriveRankingHint({ layout, breakdown: result.breakdown })
      : null;

  const comprehension = useMemo(() => {
    if (!result || !ngramStats) {
      return null;
    }

    const baselineTotal = getBaselineScore(presetId, ngramStats);
    const verdict = deriveVerdict(result.total, baselineTotal);
    const insights = deriveInsights(result.breakdown, {
      baselineTotal,
      incomplete,
    });
    const { strengths, weaknesses } = partitionInsights(insights);

    return { verdict, strengths, weaknesses, baselineTotal };
  }, [result, ngramStats, presetId, incomplete]);

  return (
    <aside
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"
      aria-label="پنل امتیازدهی"
    >
      <div className="mb-3">
        <ViewModeToggle mode={mode} onChange={setMode} />
      </div>

      {mode === "simple" ? (
        <ScoreHero
          total={null}
          presetId={presetId}
          isStale={isStale}
          onPresetChange={setPresetId}
          hideScore
        />
      ) : (
        <ScoreHero
          total={result?.total ?? null}
          presetId={presetId}
          isStale={isStale}
          onPresetChange={setPresetId}
        />
      )}

      {error ? (
        <p className="mt-3 text-sm text-amber-300" role="alert">
          {error}
        </p>
      ) : null}

      {mode === "simple" && comprehension ? (
        <div className="mt-3 border-t border-slate-800 pt-3">
          <VerdictGauge
            verdict={comprehension.verdict}
            isStale={isStale}
            scoreDelta={scoreDelta}
            showScoreDelta={showScoreDelta}
          />
        </div>
      ) : null}

      {hint ? (
        <div className="mt-3 border-t border-slate-800 pt-3">
          <RankingHint hint={hint} />
        </div>
      ) : null}

      {result && mode === "simple" ? (
        <>
          <div className="mt-4 border-t border-slate-800 pt-4">
            <StrengthsWeaknesses
              strengths={comprehension?.strengths ?? []}
              weaknesses={comprehension?.weaknesses ?? []}
              incomplete={incomplete}
            />
          </div>

          <div className="mt-4 space-y-4 border-t border-slate-800 pt-4">
            <FingerLoadChart fingerLoad={result.breakdown.fingerLoad} />
            <HandBalanceBar
              handBalance={result.breakdown.handBalance}
              leftHandShare={result.breakdown.leftHandShare}
              rightHandShare={result.breakdown.rightHandShare}
            />
          </div>

          <div className="mt-4 border-t border-slate-800 pt-4">
            <HotspotList
              hotspots={result.hotspots}
              layout={layout}
              onHotspotSelect={onHotspotSelect}
              variant="simple"
            />
          </div>

          <div className="mt-4 border-t border-slate-800 pt-4">
            <MetricsHelp />
          </div>
        </>
      ) : null}

      {result && mode === "expert" ? (
        <>
          <div className="mt-4 border-t border-slate-800 pt-4">
            <HotspotList
              hotspots={result.hotspots}
              layout={layout}
              onHotspotSelect={onHotspotSelect}
              variant="expert"
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
