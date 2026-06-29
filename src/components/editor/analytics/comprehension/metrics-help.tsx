"use client";

import { useState } from "react";

import { METRIC_GLOSSARY } from "./metric-glossary";
import { MetricInfo } from "./metric-info";
import { COMPREHENSION_SECTION_FA } from "./comprehension-labels";

export function MetricsHelp() {
  const [open, setOpen] = useState(false);
  const panelId = "metrics-help-panel";

  return (
    <div className="rounded-lg border border-slate-800">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/60 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
      >
        <span>{COMPREHENSION_SECTION_FA.metricsHelp}</span>
        <span className="text-slate-500" aria-hidden="true">
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open ? (
        <div
          id={panelId}
          className="space-y-3 border-t border-slate-800 px-3 py-3"
        >
          {METRIC_GLOSSARY.map((entry) => (
            <div key={entry.termFa} className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-200">
                  {entry.termFa}
                </span>
                <MetricInfo entry={entry} />
              </div>
              <p className="mt-0.5 leading-relaxed text-slate-400">
                {entry.definitionFa}
              </p>
              {entry.exampleFa ? (
                <p className="text-slate-500">{entry.exampleFa}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
