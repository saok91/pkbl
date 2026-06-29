"use client";

import { useState } from "react";

import type { ScoreBreakdown } from "@/lib/scoring/types";

import {
  ANALYTICS_PANEL_SECTION_FA,
  BREAKDOWN_FIELD_FA,
  BREAKDOWN_SECTION_FA,
} from "./analytics-labels";
import { FingerLoadBars } from "./finger-load-bars";
import {
  formatCost,
  formatCount,
  formatPercent,
  formatRatio,
  formatSignedScore,
} from "./format-analytics";
import { MetricRow } from "./metric-row";
import { metricInfoForField } from "./metric-info-map";

type BreakdownAccordionProps = {
  breakdown: ScoreBreakdown;
};

type SectionId = keyof typeof BREAKDOWN_SECTION_FA;

const SECTIONS: readonly SectionId[] = ["ngram", "ergonomics", "penalties"];

function breakdownPanelId(sectionId: SectionId): string {
  return `breakdown-panel-${sectionId}`;
}

function breakdownTriggerId(sectionId: SectionId): string {
  return `breakdown-trigger-${sectionId}`;
}

export function BreakdownAccordion({ breakdown }: BreakdownAccordionProps) {
  const [openSections, setOpenSections] = useState<ReadonlySet<SectionId>>(
    () => new Set(["ngram"]),
  );

  const toggleSection = (sectionId: SectionId) => {
    setOpenSections((previous) => {
      const next = new Set(previous);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium tracking-wide text-slate-400 uppercase">
        {ANALYTICS_PANEL_SECTION_FA.breakdown}
      </h3>
      {SECTIONS.map((sectionId) => {
        const isOpen = openSections.has(sectionId);
        const triggerId = breakdownTriggerId(sectionId);
        const panelId = breakdownPanelId(sectionId);
        return (
          <div
            key={sectionId}
            className="overflow-hidden rounded-lg border border-slate-800"
          >
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleSection(sectionId)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/60 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              <span>{BREAKDOWN_SECTION_FA[sectionId]}</span>
              <span className="text-slate-500" aria-hidden="true">
                {isOpen ? "▾" : "▸"}
              </span>
            </button>
            {isOpen ? (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="border-t border-slate-800 px-3 py-2"
              >
                {sectionId === "ngram" ? (
                  <>
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.unigramScore}
                      value={formatSignedScore(breakdown.unigramScore)}
                      info={metricInfoForField("unigramScore")}
                    />
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.bigramScore}
                      value={formatSignedScore(breakdown.bigramScore)}
                      info={metricInfoForField("bigramScore")}
                    />
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.trigramScore}
                      value={formatSignedScore(breakdown.trigramScore)}
                      info={metricInfoForField("trigramScore")}
                    />
                  </>
                ) : null}
                {sectionId === "ergonomics" ? (
                  <>
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.homeRowUsage}
                      value={formatPercent(breakdown.homeRowUsage)}
                      info={metricInfoForField("homeRowUsage")}
                    />
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.handBalance}
                      value={formatRatio(breakdown.handBalance)}
                      info={metricInfoForField("handBalance")}
                    />
                    <div className="py-2">
                      <p className="mb-2 text-xs text-slate-400">
                        {BREAKDOWN_FIELD_FA.fingerLoad}
                      </p>
                      <FingerLoadBars fingerLoad={breakdown.fingerLoad} />
                    </div>
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.sameFingerBigrams}
                      value={formatCount(breakdown.sameFingerBigrams)}
                      info={metricInfoForField("sameFingerBigrams")}
                    />
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.sameHandBigrams}
                      value={formatCount(breakdown.sameHandBigrams)}
                      info={metricInfoForField("sameHandBigrams")}
                    />
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.handAlternation}
                      value={formatCount(breakdown.handAlternation)}
                      info={metricInfoForField("handAlternation")}
                    />
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.rowSwitching}
                      value={formatCount(breakdown.rowSwitching)}
                      info={metricInfoForField("rowSwitching")}
                    />
                  </>
                ) : null}
                {sectionId === "penalties" ? (
                  <>
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.weakKeyPenalty}
                      value={formatCost(breakdown.weakKeyPenalty)}
                      info={metricInfoForField("weakKeyPenalty")}
                    />
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.unigramCost}
                      value={formatCost(breakdown.unigramCost)}
                      info={metricInfoForField("unigramCost")}
                      muted
                    />
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.bigramCost}
                      value={formatCost(breakdown.bigramCost)}
                      info={metricInfoForField("bigramCost")}
                      muted
                    />
                    <MetricRow
                      label={BREAKDOWN_FIELD_FA.trigramCost}
                      value={formatCost(breakdown.trigramCost)}
                      info={metricInfoForField("trigramCost")}
                      muted
                    />
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
