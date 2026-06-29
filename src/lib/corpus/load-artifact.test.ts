import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";

import { DEFAULT_NORMALIZATION_CONFIG } from "./config";
import {
  loadPresetNgramStats,
  parseNgramArtifact,
  resolvePresetArtifactPath,
} from "./load-artifact";
import { ngramStatsToArtifact } from "./serialize";
import { extractNgrams } from "./ngram-extract";

const ARTIFACT_DIR = join(process.cwd(), "packages", "corpus-data");

describe("resolvePresetArtifactPath", () => {
  it("throws for unknown preset", () => {
    expect(() => resolvePresetArtifactPath("unknown", ARTIFACT_DIR)).toThrow(
      /Unknown corpus preset: unknown/,
    );
  });

  it("resolves artifact path for wiki-fa", () => {
    const path = resolvePresetArtifactPath("wiki-fa", ARTIFACT_DIR);
    expect(path).toBe(join(ARTIFACT_DIR, "wiki-fa.ngrams.json"));
  });
});

describe("parseNgramArtifact", () => {
  it("parses valid artifact JSON", () => {
    const stats = extractNgrams(
      "سلام",
      "wiki-fa",
      DEFAULT_NORMALIZATION_CONFIG,
    );
    const artifact = ngramStatsToArtifact(
      stats,
      "1",
      "2026-06-28T00:00:00.000Z",
    );
    const parsed = parseNgramArtifact(JSON.stringify(artifact));

    expect(parsed.corpusId).toBe("wiki-fa");
    expect(parsed.totalChars).toBe(stats.totalChars);
    expect(parsed.unigrams.get("س")).toBe(1);
  });

  it("throws on invalid JSON", () => {
    expect(() => parseNgramArtifact("{not-json")).toThrow(
      /Invalid n-gram artifact JSON/,
    );
  });

  it("throws on missing required fields", () => {
    expect(() =>
      parseNgramArtifact(JSON.stringify({ corpusId: "wiki-fa" })),
    ).toThrow(/Invalid n-gram artifact/);
  });
});

describe("loadPresetNgramStats", () => {
  it.skipIf(!existsSync(join(ARTIFACT_DIR, "wiki-fa.ngrams.json")))(
    "loads wiki-fa precomputed artifact",
    () => {
      const stats = loadPresetNgramStats("wiki-fa", ARTIFACT_DIR);
      expect(stats.corpusId).toBe("wiki-fa");
      expect(stats.normalizedVersion).toBe(
        DEFAULT_NORMALIZATION_CONFIG.normalizedVersion,
      );
      expect(stats.totalChars).toBeGreaterThan(0);
      expect(stats.unigrams.size).toBeGreaterThan(0);
    },
  );

  it.skipIf(!existsSync(join(ARTIFACT_DIR, "varzesh3.ngrams.json")))(
    "loads varzesh3 precomputed artifact",
    () => {
      const stats = loadPresetNgramStats("varzesh3", ARTIFACT_DIR);
      expect(stats.corpusId).toBe("varzesh3");
      expect(stats.totalChars).toBeGreaterThan(0);
    },
  );

  it("loads artifact with custom manifest path", () => {
    const tempDir = mkdtempSync(join(tmpdir(), "pkbl-corpus-"));
    const manifestPath = join(tempDir, "manifest.json");
    writeFileSync(
      manifestPath,
      JSON.stringify({
        "wiki-fa": {
          charCount: 42,
          version: "1",
          builtAt: "2026-06-28T00:00:00.000Z",
        },
      }),
    );

    const stats = extractNgrams(
      "سلام",
      "wiki-fa",
      DEFAULT_NORMALIZATION_CONFIG,
    );
    const artifact = ngramStatsToArtifact(
      stats,
      "1",
      "2026-06-28T00:00:00.000Z",
    );
    writeFileSync(
      join(tempDir, "wiki-fa.ngrams.json"),
      `${JSON.stringify(artifact)}\n`,
    );

    const loaded = loadPresetNgramStats("wiki-fa", tempDir, manifestPath);
    expect(loaded.corpusId).toBe("wiki-fa");
    expect(loaded.totalChars).toBe(stats.totalChars);
  });
});
