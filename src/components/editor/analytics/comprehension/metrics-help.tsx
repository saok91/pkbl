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
        className="text-text-dim hover:text-text-secondary focus-visible:ring-primary flex w-full items-center justify-between text-[11px] transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <span>{COMPREHENSION_SECTION_FA.metricsHelp}</span>
        <span className="text-text-faint" aria-hidden="true">
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open ? (
        <div
          id={panelId}
          className="border-border-strong/40 mt-2 space-y-3 border-t pt-3"
        >
          {METRIC_GLOSSARY.map((entry) => (
            <div key={entry.termFa} className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-text-secondary font-medium">
                  {entry.termFa}
                </span>
                <MetricInfo entry={entry} />
              </div>
              <p className="text-text-dim mt-0.5 leading-relaxed">
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
