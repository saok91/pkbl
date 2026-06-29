import { describe, expect, it } from "vitest";

import { DEFAULT_NORMALIZATION_CONFIG } from "./config";
import { extractNgrams, mergeNgramStats } from "./ngram-extract";

describe("extractNgrams", () => {
  it("returns empty stats for empty text", () => {
    const stats = extractNgrams("", "custom", DEFAULT_NORMALIZATION_CONFIG);
    expect(stats.totalChars).toBe(0);
    expect(stats.unigrams.size).toBe(0);
    expect(stats.bigrams.size).toBe(0);
    expect(stats.trigrams.size).toBe(0);
    expect(stats.corpusId).toBe("custom");
    expect(stats.normalizedVersion).toBe(
      DEFAULT_NORMALIZATION_CONFIG.normalizedVersion,
    );
  });

  it("counts a single target char", () => {
    const stats = extractNgrams("ا", "custom", DEFAULT_NORMALIZATION_CONFIG);
    expect(stats.totalChars).toBe(1);
    expect(stats.unigrams.get("ا")).toBe(1);
    expect(stats.bigrams.size).toBe(0);
    expect(stats.trigrams.size).toBe(0);
  });

  it("includes ZWNJ in n-grams", () => {
    const zwnj = "\u200c";
    const stats = extractNgrams(
      `می${zwnj}خواهم`,
      "custom",
      DEFAULT_NORMALIZATION_CONFIG,
    );
    expect(stats.totalChars).toBe(8);
    expect(stats.bigrams.has(`ی${zwnj}`)).toBe(true);
    expect(stats.bigrams.has(`${zwnj}خ`)).toBe(true);
  });

  it("filters chars outside target charset", () => {
    const stats = extractNgrams(
      "سلامhello",
      "custom",
      DEFAULT_NORMALIZATION_CONFIG,
    );
    expect(stats.totalChars).toBe(4);
    expect(stats.unigrams.has("h")).toBe(false);
    expect(stats.unigrams.get("س")).toBe(1);
    expect(stats.bigrams.get("سل")).toBe(1);
  });

  it("includes space when it is in target charset", () => {
    const stats = extractNgrams(
      "سلام hello",
      "custom",
      DEFAULT_NORMALIZATION_CONFIG,
    );
    expect(stats.totalChars).toBe(5);
    expect(stats.unigrams.get(" ")).toBe(1);
  });

  it("is deterministic for the same input", () => {
    const text = "این یک متن آزمایشی است";
    const first = extractNgrams(text, "custom", DEFAULT_NORMALIZATION_CONFIG);
    const second = extractNgrams(text, "custom", DEFAULT_NORMALIZATION_CONFIG);
    expect(first).toEqual(second);
  });

  it("computes unigram, bigram, and trigram counts", () => {
    const stats = extractNgrams("abc", "custom", {
      ...DEFAULT_NORMALIZATION_CONFIG,
      digitPolicy: "preserve",
    });
    expect(stats.totalChars).toBe(0);

    const persian = extractNgrams(
      "سلام",
      "custom",
      DEFAULT_NORMALIZATION_CONFIG,
    );
    expect(persian.unigrams.get("س")).toBe(1);
    expect(persian.unigrams.get("ل")).toBe(1);
    expect(persian.bigrams.get("سل")).toBe(1);
    expect(persian.bigrams.get("لا")).toBe(1);
    expect(persian.trigrams.get("سلا")).toBe(1);
  });
});

describe("mergeNgramStats", () => {
  it("returns empty stats for empty parts", () => {
    const merged = mergeNgramStats(
      "wiki-fa",
      DEFAULT_NORMALIZATION_CONFIG.normalizedVersion,
      [],
    );

    expect(merged.corpusId).toBe("wiki-fa");
    expect(merged.totalChars).toBe(0);
    expect(merged.unigrams.size).toBe(0);
    expect(merged.bigrams.size).toBe(0);
    expect(merged.trigrams.size).toBe(0);
    expect(merged.normalizedVersion).toBe(
      DEFAULT_NORMALIZATION_CONFIG.normalizedVersion,
    );
  });

  it("sums frequencies and totalChars across parts", () => {
    const partA = extractNgrams(
      "سلام",
      "wiki-fa",
      DEFAULT_NORMALIZATION_CONFIG,
    );
    const partB = extractNgrams(
      "سلام",
      "wiki-fa",
      DEFAULT_NORMALIZATION_CONFIG,
    );

    const merged = mergeNgramStats(
      "wiki-fa",
      DEFAULT_NORMALIZATION_CONFIG.normalizedVersion,
      [partA, partB],
    );

    expect(merged.totalChars).toBe(partA.totalChars + partB.totalChars);
    expect(merged.unigrams.get("س")).toBe(2);
    expect(merged.unigrams.get("ل")).toBe(2);
    expect(merged.bigrams.get("سل")).toBe(2);
    expect(merged.trigrams.get("سلا")).toBe(2);
  });

  it("throws when part normalizedVersion differs", () => {
    const compatible = extractNgrams(
      "سلام",
      "wiki-fa",
      DEFAULT_NORMALIZATION_CONFIG,
    );
    const incompatible = extractNgrams("دنیا", "wiki-fa", {
      ...DEFAULT_NORMALIZATION_CONFIG,
      normalizedVersion: "fa-normalize-v2",
    });

    expect(() =>
      mergeNgramStats(
        "wiki-fa",
        DEFAULT_NORMALIZATION_CONFIG.normalizedVersion,
        [compatible, incompatible],
      ),
    ).toThrow(/Normalized version mismatch/);
  });
});
