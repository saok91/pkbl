"use client";

import {
  CLIENT_CORPUS_PRESETS,
  type CorpusPresetId,
} from "@/lib/corpus/client-presets";

type LeaderboardPresetFilterProps = {
  readonly value: CorpusPresetId;
  readonly onChange: (presetId: CorpusPresetId) => void;
};

export function LeaderboardPresetFilter({
  value,
  onChange,
}: LeaderboardPresetFilterProps) {
  const activePreset = CLIENT_CORPUS_PRESETS.find(
    (preset) => preset.id === value,
  );

  return (
    <div className="max-w-md">
      <label
        htmlFor="leaderboard-corpus-preset"
        className="mb-1.5 block text-sm font-medium text-slate-300"
      >
        فیلتر corpus
      </label>
      <select
        id="leaderboard-corpus-preset"
        value={value}
        onChange={(event) => {
          onChange(event.target.value as CorpusPresetId);
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
        <p className="mt-1.5 text-xs text-slate-500">
          {activePreset.descriptionFa}
        </p>
      ) : null}
    </div>
  );
}

export function getCorpusPresetLabel(presetId: CorpusPresetId): string {
  return (
    CLIENT_CORPUS_PRESETS.find((preset) => preset.id === presetId)?.nameFa ??
    presetId
  );
}
