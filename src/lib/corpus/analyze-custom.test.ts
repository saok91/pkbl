import { describe, expect, it } from "vitest";

import {
  analyzeCustomText,
  clearCustomCorpusCache,
  getCustomCorpusCacheSize,
} from "@/lib/corpus/analyze-custom";

describe("analyzeCustomText LRU cache", () => {
  it("evicts oldest entries when cache exceeds max size", () => {
    clearCustomCorpusCache();

    for (let index = 0; index < 55; index += 1) {
      analyzeCustomText(`text-${index}`);
    }

    expect(getCustomCorpusCacheSize()).toBeLessThanOrEqual(50);
  });

  it("returns cached stats for identical text", () => {
    clearCustomCorpusCache();
    const first = analyzeCustomText("سلام");
    const second = analyzeCustomText("سلام");

    expect(second).toBe(first);
    expect(getCustomCorpusCacheSize()).toBe(1);
  });
});
