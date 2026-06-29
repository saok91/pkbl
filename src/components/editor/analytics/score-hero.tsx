"use client";

import {
  CLIENT_CORPUS_PRESETS,
  type CorpusPresetId,
} from "@/lib/corpus/client-presets";

import { formatScore } from "./format-analytics";

type ScoreHeroProps = {
  total: number | null;
  presetId: CorpusPresetId;
  isStale: boolean;
  onPresetChange: (presetId: CorpusPresetId) => void;
  hideScore?: boolean;
};

export function ScoreHero({
  total,
  presetId,
  isStale,
  onPresetChange,
  hideScore = false,
}: ScoreHeroProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border-strong bg-surface-panel p-3">
        <div className="mb-2 text-[10px] tracking-wider text-text-faint uppercase">
          پیکره متنی
        </div>
        <div className="flex gap-1.5">
          {CLIENT_CORPUS_PRESETS.map((preset) => {
            const isActive = preset.id === presetId;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onPresetChange(preset.id)}
                className={`flex-1 rounded-lg border px-2 py-2 text-center text-[11px] transition-all ${
                  isActive
                    ? "border-primary/35 bg-primary/12 text-primary"
                    : "border-border-strong text-text-dim hover:text-text-secondary"
                }`}
              >
                <div className="font-medium">{preset.nameFa}</div>
                <div className="mt-0.5 text-[9px] text-text-faint">
                  {preset.descriptionFa}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {hideScore ? null : (
        <div
          className={
            isStale
              ? "opacity-60 transition-opacity"
              : "opacity-100 transition-opacity"
          }
        >
          <p className="text-[10px] text-text-dim">امتیاز کلی</p>
          <p
            className="font-mono text-3xl font-bold tracking-tight text-foreground tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {total !== null ? formatScore(total) : "—"}
          </p>
          <p className="text-[10px] text-text-faint">بالاتر بهتر</p>
        </div>
      )}
    </div>
  );
}
