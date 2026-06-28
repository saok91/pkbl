import { describe, expect, it } from "vitest";

import { assertNgramArtifact } from "./validate-artifact";

const VALID_ARTIFACT = {
  corpusId: "wiki-fa",
  version: "1",
  normalizedVersion: "fa-normalize-v1",
  charCount: 2,
  builtAt: "2026-06-28T00:00:00.000Z",
  unigrams: { س: 1, ل: 1 },
  bigrams: { سل: 1 },
  trigrams: {},
};

describe("assertNgramArtifact", () => {
  it("accepts a valid artifact", () => {
    expect(() => assertNgramArtifact(VALID_ARTIFACT)).not.toThrow();
  });

  it("rejects non-object payloads", () => {
    expect(() => assertNgramArtifact(null)).toThrow(/expected object/);
    expect(() => assertNgramArtifact("text")).toThrow(/expected object/);
  });

  it("rejects missing corpusId", () => {
    const { corpusId: _removed, ...invalid } = VALID_ARTIFACT;
    expect(() => assertNgramArtifact(invalid)).toThrow(/corpusId/);
  });

  it("rejects missing normalizedVersion", () => {
    const { normalizedVersion: _removed, ...invalid } = VALID_ARTIFACT;
    expect(() => assertNgramArtifact(invalid)).toThrow(/normalizedVersion/);
  });

  it("rejects invalid charCount", () => {
    expect(() =>
      assertNgramArtifact({ ...VALID_ARTIFACT, charCount: -1 }),
    ).toThrow(/charCount/);
    expect(() =>
      assertNgramArtifact({ ...VALID_ARTIFACT, charCount: "2" }),
    ).toThrow(/charCount/);
  });

  it("rejects invalid frequency records", () => {
    expect(() =>
      assertNgramArtifact({ ...VALID_ARTIFACT, unigrams: { س: -1 } }),
    ).toThrow(/unigrams/);
    expect(() =>
      assertNgramArtifact({ ...VALID_ARTIFACT, bigrams: null }),
    ).toThrow(/bigrams/);
  });
});
