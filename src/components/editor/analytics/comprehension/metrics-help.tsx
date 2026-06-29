"use client";

import { useState } from "react";

import { METRIC_GLOSSARY } from "./metric-glossary";
import { MetricInfo } from "./metric-info";
import { COMPREHENSION_SECTION_FA } from "./comprehension-labels";

export function MetricsHelp() {
  const [open, setOpen] = useState(false);
  const panelId = "metrics-help-panel";

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between text-[11px] text-text-dim transition-colors hover:text-text-secondary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        <span>{COMPREHENSION_SECTION_FA.metricsHelp}</span>
        <span className="text-text-faint" aria-hidden="true">
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open ? (
        <div id={panelId} className="mt-2 space-y-3 border-t border-border-strong/40 pt-3">
          {METRIC_GLOSSARY.map((entry) => (
            <div key={entry.termFa} className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-text-secondary">
                  {entry.termFa}
                </span>
                <MetricInfo entry={entry} />
              </div>
              <p className="mt-0.5 leading-relaxed text-text-dim">
                {entry.definitionFa}
              </p>
              {entry.exampleFa ? (
                <p className="text-text-faint">{entry.exampleFa}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
