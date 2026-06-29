import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const LIB_ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");

function collectSourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectSourceFiles(fullPath);
    }
    if (entry.name.endsWith(".test.ts")) {
      return [];
    }
    if (entry.name.endsWith(".ts")) {
      return [fullPath];
    }
    return [];
  });
}

describe("src/lib boundary", () => {
  it("does not import React in domain modules", () => {
    const files = collectSourceFiles(LIB_ROOT);
    const reactImport = /from\s+["']react(?:\/|$)/;

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      expect(content, file).not.toMatch(reactImport);
    }
  });
});

describe("domain module registry", () => {
  it("exports all six domain modules", async () => {
    const [layout, ergonomics, corpus, scoring, leaderboard, exportMod] =
      await Promise.all([
        import("@/lib/layout"),
        import("@/lib/ergonomics"),
        import("@/lib/corpus"),
        import("@/lib/scoring"),
        import("@/lib/leaderboard"),
        import("@/lib/export"),
      ]);

    expect(layout.LAYOUT_MODULE).toBe("layout");
    expect(layout.parseKle).toBeTypeOf("function");
    expect(layout.assignChar).toBeTypeOf("function");
    expect(ergonomics.ERGONOMICS_MODULE).toBe("ergonomics");
    expect(ergonomics.getKeyMetrics).toBeTypeOf("function");
    expect(ergonomics.getFingerMap60).toBeTypeOf("function");
    expect(corpus.CORPUS_MODULE).toBe("corpus");
    expect(corpus.normalizePersianText).toBeTypeOf("function");
    expect(corpus.extractNgrams).toBeTypeOf("function");
    expect(corpus.listPresets).toBeTypeOf("function");
    expect(corpus.loadPresetNgramStats).toBeTypeOf("function");
    expect(scoring.SCORING_MODULE).toBe("scoring");
    expect(scoring.computeScore).toBeTypeOf("function");
    expect(leaderboard.LEADERBOARD_MODULE).toBe("leaderboard");
    expect(leaderboard.computeLayoutFingerprint).toBeTypeOf("function");
    expect(exportMod.EXPORT_MODULE).toBe("export");
  });
});
