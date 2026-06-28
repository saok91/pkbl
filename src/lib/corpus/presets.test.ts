import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { artifactToNgramStats, ngramStatsToArtifact } from "./serialize";
import { extractNgrams } from "./ngram-extract";
import { DEFAULT_NORMALIZATION_CONFIG } from "./config";
import { getPresetById, listPresets } from "./presets";

describe("listPresets", () => {
  it("returns wiki-fa and varzesh3 presets", () => {
    const presets = listPresets();
    expect(presets).toHaveLength(2);
    expect(presets.map((preset) => preset.id)).toEqual([
      "wiki-fa",
      "varzesh3",
    ]);
  });

  it("includes Persian metadata", () => {
    const wiki = getPresetById("wiki-fa");
    expect(wiki?.nameFa).toBe("ویکی‌پدیا فارسی");
    expect(wiki?.descriptionFa.length).toBeGreaterThan(0);
  });

  it("reads charCount from a custom manifest path", () => {
    const tempDir = mkdtempSync(join(tmpdir(), "pkbl-manifest-"));
    const manifestPath = join(tempDir, "manifest.json");
    writeFileSync(
      manifestPath,
      JSON.stringify({
        "wiki-fa": {
          charCount: 999_999,
          version: "2",
          builtAt: "2026-06-28T00:00:00.000Z",
        },
      }),
    );

    const wiki = getPresetById("wiki-fa", manifestPath);
    expect(wiki?.charCount).toBe(999_999);
    expect(wiki?.version).toBe("2");
  });

  it("throws on invalid manifest JSON", () => {
    const tempDir = mkdtempSync(join(tmpdir(), "pkbl-manifest-"));
    const manifestPath = join(tempDir, "manifest.json");
    writeFileSync(manifestPath, "{broken");

    expect(() => listPresets(manifestPath)).toThrow(/Invalid corpus manifest JSON/);
  });

  it("throws on invalid manifest entry", () => {
    const tempDir = mkdtempSync(join(tmpdir(), "pkbl-manifest-"));
    const manifestPath = join(tempDir, "manifest.json");
    writeFileSync(
      manifestPath,
      JSON.stringify({ "wiki-fa": { charCount: "bad", version: "1" } }),
    );

    expect(() => listPresets(manifestPath)).toThrow(/charCount/);
  });
});

describe("artifact round-trip", () => {
  it("preserves stats through JSON serialization", () => {
    const stats = extractNgrams(
      "سلام دنیا",
      "wiki-fa",
      DEFAULT_NORMALIZATION_CONFIG,
    );
    const artifact = ngramStatsToArtifact(
      stats,
      "1",
      "2026-06-28T00:00:00.000Z",
    );
    const restored = artifactToNgramStats(artifact);

    expect(restored.totalChars).toBe(stats.totalChars);
    expect(restored.corpusId).toBe("wiki-fa");
    expect(restored.normalizedVersion).toBe(
      DEFAULT_NORMALIZATION_CONFIG.normalizedVersion,
    );
    expect(restored.unigrams.get("س")).toBe(1);
  });
});
