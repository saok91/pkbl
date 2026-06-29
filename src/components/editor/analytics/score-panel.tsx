"use client";

import { useMemo } from "react";

import type { Layout } from "@/lib/layout/types";
import { getCompletenessScore } from "@/lib/layout/analysis";
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
import { formatScore } from "./format-analytics";
import type { LiveScoreState } from "./use-live-score";

type ScorePanelProps = {
  layout: Layout;
  liveScore: LiveScoreState;
  onHotspotSelect: (keyId: string) => void;
  onOpenSubmit?: () => void;
};

export function ScorePanel({
  layout,
  liveScore,
  onHotspotSelect,
  onOpenSubmit,
}: ScorePanelProps) {
  const { result, ngramStats, isStale, error, presetId, setPresetId, scoreDelta, showScoreDelta } =
    liveScore;
  const { mode, setMode } = useAnalyticsViewMode();

  const incomplete = hasUnassignedEditableChars(layout);
  const completeness = useMemo(
    () => getCompletenessScore(layout),
    [layout],
  );

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

  const panelCardClass =
    "rounded-xl border border-border-strong bg-surface-panel p-3";

  return (
    <aside className="space-y-3" aria-label="پنل امتیازدهی">
      <div className={panelCardClass}>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] tracking-wider text-text-faint uppercase">
            پوشش حروف
          </span>
          <span
            className={`font-mono text-[11px] font-semibold tabular-nums ${
              completeness === 100
                ? "text-primary"
                : completeness > 70
                  ? "text-accent"
                  : "text-destructive"
            }`}
          >
            {formatScore(completeness)}٪
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#0A1525]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              completeness === 100
                ? "bg-primary"
                : completeness > 70
                  ? "bg-accent"
                  : "bg-destructive"
            }`}
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      <ScoreHero
        total={null}
        presetId={presetId}
        isStale={isStale}
        onPresetChange={setPresetId}
        hideScore
      />

      <div className="flex rounded-lg border border-border-strong bg-surface-panel p-1">
        <ViewModeToggle mode={mode} onChange={setMode} />
      </div>

      {error ? (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}

      {mode === "simple" && comprehension ? (
        <VerdictGauge
          verdict={comprehension.verdict}
          isStale={isStale}
          scoreDelta={scoreDelta}
          showScoreDelta={showScoreDelta}
        />
      ) : null}

      {mode === "expert" && result ? (
        <div className="rounded-xl border border-border-strong bg-surface-panel p-3">
          <p className="text-[10px] text-text-dim">امتیاز کلی</p>
          <p
            className={`font-mono text-3xl font-bold tracking-tight tabular-nums ${
              isStale ? "opacity-60" : ""
            }`}
            aria-live="polite"
          >
            {formatScore(result.total)}
          </p>
          <p className="text-[10px] text-text-faint">بالاتر بهتر</p>
        </div>
      ) : null}

      {hint ? (
        <div className="flex items-start gap-2 rounded-lg border border-border-strong bg-[#070E1A] px-3 py-2 text-[11px] text-text-dim">
          <span aria-hidden="true" className="text-accent">
            ⚡
          </span>
          <RankingHint hint={hint} />
        </div>
      ) : null}

      {result && mode === "simple" ? (
        <>
          <div className={panelCardClass}>
            <div className="mb-2 text-[10px] tracking-wider text-text-faint uppercase">
              قوت‌ها و ضعف‌ها
            </div>
            <StrengthsWeaknesses
              strengths={comprehension?.strengths ?? []}
              weaknesses={comprehension?.weaknesses ?? []}
              incomplete={incomplete}
            />
          </div>

          <div className={panelCardClass}>
            <FingerLoadChart fingerLoad={result.breakdown.fingerLoad} />
          </div>

          <div className={panelCardClass}>
            <HandBalanceBar
              handBalance={result.breakdown.handBalance}
              leftHandShare={result.breakdown.leftHandShare}
              rightHandShare={result.breakdown.rightHandShare}
            />
          </div>

          <div className={panelCardClass}>
            <HotspotList
              hotspots={result.hotspots}
              layout={layout}
              onHotspotSelect={onHotspotSelect}
              variant="simple"
            />
          </div>

          <div className={panelCardClass}>
            <MetricsHelp />
          </div>
        </>
      ) : null}

      {result && mode === "expert" ? (
        <>
          <div className={panelCardClass}>
            <HotspotList
              hotspots={result.hotspots}
              layout={layout}
              onHotspotSelect={onHotspotSelect}
              variant="expert"
            />
          </div>
          <div className={panelCardClass}>
            <BreakdownAccordion breakdown={result.breakdown} />
          </div>
        </>
      ) : null}

      {onOpenSubmit ? (
        <button
          type="button"
          onClick={onOpenSubmit}
          disabled={!result || isStale}
          className="w-full rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-colors enabled:hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ثبت در جدول امتیازات
        </button>
      ) : null}
    </aside>
  );
}
