/** Built-in corpus preset ids available in the client UI (E6). */
export type CorpusPresetId = "wiki-fa" | "varzesh3";

export type ClientCorpusPreset = {
  readonly id: CorpusPresetId;
  readonly nameFa: string;
  readonly descriptionFa: string;
};

export const CLIENT_CORPUS_PRESETS: readonly ClientCorpusPreset[] = [
  {
    id: "wiki-fa",
    nameFa: "ویکی‌پدیا فارسی",
    descriptionFa:
      "متن عمومی و دانشی از مقالات ویکی‌پدیا فارسی — مناسب برای نوشتار رسمی.",
  },
  {
    id: "varzesh3",
    nameFa: "ورزش۳",
    descriptionFa: "کامنت‌های ورزش۳ — زبان محاوره‌ای و ورزشی برای تایپ روزمره.",
  },
] as const;

export const DEFAULT_CORPUS_PRESET_ID: CorpusPresetId = "wiki-fa";

export const CORPUS_PRESET_STORAGE_KEY = "pkbl-corpus-preset";

export function isCorpusPresetId(value: string): value is CorpusPresetId {
  return value === "wiki-fa" || value === "varzesh3";
}

export function readStoredCorpusPresetId(): CorpusPresetId {
  if (typeof window === "undefined") {
    return DEFAULT_CORPUS_PRESET_ID;
  }
  const stored = localStorage.getItem(CORPUS_PRESET_STORAGE_KEY);
  if (stored && isCorpusPresetId(stored)) {
    return stored;
  }
  return DEFAULT_CORPUS_PRESET_ID;
}

export function writeStoredCorpusPresetId(presetId: CorpusPresetId): void {
  localStorage.setItem(CORPUS_PRESET_STORAGE_KEY, presetId);
}
