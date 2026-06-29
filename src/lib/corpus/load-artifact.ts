import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DEFAULT_CORPUS_DATA_DIR,
  DEFAULT_MANIFEST_PATH,
  getPresetById,
} from "./presets";
import { parseNgramArtifact } from "./parse-artifact";
import type { NgramStats } from "./types";

/** Resolve artifact file path for a preset id. */
export function resolvePresetArtifactPath(
  presetId: string,
  artifactDir: string = DEFAULT_CORPUS_DATA_DIR,
  manifestPath: string = DEFAULT_MANIFEST_PATH,
): string {
  const preset = getPresetById(presetId, manifestPath);
  if (!preset) {
    throw new Error(`Unknown corpus preset: ${presetId}`);
  }
  return join(artifactDir, preset.artifactFileName);
}

/** Load precomputed n-gram artifact for a preset (E3-S4). */
export function loadPresetNgramStats(
  presetId: string,
  artifactDir: string = DEFAULT_CORPUS_DATA_DIR,
  manifestPath: string = DEFAULT_MANIFEST_PATH,
): NgramStats {
  const artifactPath = resolvePresetArtifactPath(
    presetId,
    artifactDir,
    manifestPath,
  );
  const raw = readFileSync(artifactPath, "utf8");
  const stats = parseNgramArtifact(raw);

  if (stats.corpusId !== presetId) {
    throw new Error(
      `Artifact corpusId mismatch: expected ${presetId}, got ${stats.corpusId}`,
    );
  }

  return stats;
}

export { parseNgramArtifact } from "./parse-artifact";
