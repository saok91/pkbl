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
};

export function ScoreHero({
  total,
  presetId,
  isStale,
  onPresetChange,
}: ScoreHeroProps) {
  const activePreset = CLIENT_CORPUS_PRESETS.find(
    (preset) => preset.id === presetId,
  );
  const descriptionId = "corpus-preset-description";

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="corpus-preset"
          className="mb-1.5 block text-xs font-medium text-slate-400"
        >
          corpus امتیازدهی
        </label>
        <select
          id="corpus-preset"
          value={presetId}
          aria-describedby={descriptionId}
          onChange={(event) => {
            onPresetChange(event.target.value as CorpusPresetId);
          }}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
        >
          {CLIENT_CORPUS_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.nameFa}
            </option>
          ))}
        </select>
        {activePreset ? (
          <p id={descriptionId} className="mt-1.5 text-xs text-slate-500">
            {activePreset.descriptionFa}
          </p>
        ) : null}
      </div>

      <div
        className={
          isStale
            ? "opacity-60 transition-opacity"
            : "opacity-100 transition-opacity"
        }
      >
        <p className="text-xs text-slate-400">امتیاز کلی</p>
        <p
          className="text-4xl font-bold text-white tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {total !== null ? formatScore(total) : "—"}
        </p>
        <p className="text-xs text-slate-500">بالاتر بهتر</p>
      </div>
    </div>
  );
}
