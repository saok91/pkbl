import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { CorpusPreset } from "./types";

export const DEFAULT_CORPUS_DATA_DIR = join(
  process.cwd(),
  "packages",
  "corpus-data",
);

export const DEFAULT_MANIFEST_PATH = join(
  DEFAULT_CORPUS_DATA_DIR,
  "manifest.json",
);

type CorpusManifest = Readonly<
  Record<string, { charCount: number; version: string; builtAt: string }>
>;

/** Built-in corpus preset definitions (E3-S4). */
const CORPUS_PRESET_DEFINITIONS: readonly Omit<CorpusPreset, "charCount">[] = [
  {
    id: "wiki-fa",
    nameFa: "ویکی‌پدیا فارسی",
    descriptionFa:
      "متن عمومی و دانشی از مقالات ویکی‌پدیا فارسی — مناسب برای نوشتار رسمی.",
    version: "1",
    artifactFileName: "wiki-fa.ngrams.json",
  },
  {
    id: "varzesh3",
    nameFa: "ورزش۳",
    descriptionFa:
      "کامنت‌های ورزش۳ — زبان محاوره‌ای و ورزشی برای تایپ روزمره.",
    version: "1",
    artifactFileName: "varzesh3.ngrams.json",
  },
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseManifestEntry(
  presetId: string,
  value: unknown,
): { charCount: number; version: string; builtAt: string } {
  if (!isRecord(value)) {
    throw new Error(
      `Invalid corpus manifest entry for "${presetId}": expected object`,
    );
  }
  if (
    typeof value.charCount !== "number" ||
    !Number.isFinite(value.charCount) ||
    value.charCount < 0
  ) {
    throw new Error(
      `Invalid corpus manifest entry for "${presetId}": charCount must be a non-negative number`,
    );
  }
  if (typeof value.version !== "string" || value.version.length === 0) {
    throw new Error(
      `Invalid corpus manifest entry for "${presetId}": version must be a non-empty string`,
    );
  }
  if (typeof value.builtAt !== "string" || value.builtAt.length === 0) {
    throw new Error(
      `Invalid corpus manifest entry for "${presetId}": builtAt must be a non-empty string`,
    );
  }
  return {
    charCount: value.charCount,
    version: value.version,
    builtAt: value.builtAt,
  };
}

function readManifest(manifestPath: string = DEFAULT_MANIFEST_PATH): CorpusManifest {
  if (!existsSync(manifestPath)) {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    throw new Error(`Invalid corpus manifest JSON: ${manifestPath}`);
  }

  if (!isRecord(parsed)) {
    throw new Error(
      `Invalid corpus manifest: expected object at ${manifestPath}`,
    );
  }

  const manifest: Record<
    string,
    { charCount: number; version: string; builtAt: string }
  > = {};
  for (const [presetId, entry] of Object.entries(parsed)) {
    manifest[presetId] = parseManifestEntry(presetId, entry);
  }
  return manifest;
}

function resolvePreset(
  definition: Omit<CorpusPreset, "charCount">,
  manifest: CorpusManifest,
): CorpusPreset {
  const entry = manifest[definition.id];
  return {
    ...definition,
    charCount: entry?.charCount ?? 0,
    version: entry?.version ?? definition.version,
  };
}

/** List available corpus presets with metadata. */
export function listPresets(
  manifestPath: string = DEFAULT_MANIFEST_PATH,
): readonly CorpusPreset[] {
  const manifest = readManifest(manifestPath);
  return CORPUS_PRESET_DEFINITIONS.map((definition) =>
    resolvePreset(definition, manifest),
  );
}

/** Find a preset by id or return undefined. */
export function getPresetById(
  presetId: string,
  manifestPath: string = DEFAULT_MANIFEST_PATH,
): CorpusPreset | undefined {
  return listPresets(manifestPath).find((preset) => preset.id === presetId);
}
