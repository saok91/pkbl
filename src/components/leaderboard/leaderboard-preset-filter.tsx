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
  return (
    <div className="flex flex-wrap gap-2">
      {CLIENT_CORPUS_PRESETS.map((preset) => {
        const isActive = preset.id === value;
        return (
          <button
            key={preset.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(preset.id)}
            className={`rounded-lg border px-3 py-1.5 text-[11px] transition-all ${
              isActive
                ? "border-primary/30 bg-primary/12 text-primary"
                : "border-border-strong text-text-dim hover:text-text-secondary"
            }`}
          >
            {preset.nameFa}
          </button>
        );
      })}
    </div>
  );
}

export function getCorpusPresetLabel(presetId: CorpusPresetId): string {
  return (
    CLIENT_CORPUS_PRESETS.find((preset) => preset.id === presetId)?.nameFa ??
    presetId
  );
}
