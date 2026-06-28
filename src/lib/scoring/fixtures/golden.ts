import { assignChar, getBlankAnsiTemplate } from "@/lib/layout";
import { keyIdAt } from "@/lib/layout/test-utils";
import type { NgramStats } from "@/lib/corpus/types";
import type { Layout } from "@/lib/layout/types";

/** Minimal Persian layout on home-row keys for golden tests. */
export function buildGoldenLayout(): Layout {
  const layout = getBlankAnsiTemplate();
  const fKey = keyIdAt("F");
  const gKey = keyIdAt("G");
  const hKey = keyIdAt("H");
  const jKey = keyIdAt("J");
  const kKey = keyIdAt("K");

  return assignChar(
    assignChar(
      assignChar(
        assignChar(
          assignChar(layout, fKey, "base", "ا"),
          gKey,
          "base",
          "ن",
        ),
        hKey,
        "base",
        "ت",
      ),
      jKey,
      "base",
      "ر",
    ),
    kKey,
    "base",
    "س",
  );
}

/** Tiny corpus stats aligned with golden layout chars. */
export function buildGoldenNgramStats(): NgramStats {
  return {
    unigrams: new Map([
      ["ا", 20],
      ["ن", 15],
      ["ت", 10],
      ["ر", 8],
      ["س", 5],
    ]),
    bigrams: new Map([
      ["ان", 12],
      ["نت", 8],
      ["تر", 6],
      ["رس", 4],
    ]),
    trigrams: new Map([["انت", 6]]),
    totalChars: 58,
    corpusId: "golden-test",
    normalizedVersion: "norm-v1",
  };
}
