import { describe, expect, it } from "vitest";

import { corpusPresetAdvisoryLockKey } from "./preset-lock";
import { computeCompetitionRanks } from "./rank";

describe("corpusPresetAdvisoryLockKey", () => {
  it("is stable for the same preset id", () => {
    expect(corpusPresetAdvisoryLockKey("wiki-fa")).toBe(
      corpusPresetAdvisoryLockKey("wiki-fa"),
    );
  });

  it("differs across preset ids", () => {
    expect(corpusPresetAdvisoryLockKey("wiki-fa")).not.toBe(
      corpusPresetAdvisoryLockKey("varzesh3"),
    );
  });
});

describe("computeCompetitionRanks", () => {
  it("assigns the same rank to tied scores", async () => {
    const db = {
      scoreSnapshot: {
        count: async ({ where }: { where: { totalScore: { gt: number } } }) => {
          if (where.totalScore.gt === 950) {
            return 0;
          }
          if (where.totalScore.gt === 900) {
            return 1;
          }
          return 0;
        },
      },
    };

    const ranks = await computeCompetitionRanks(
      db as never,
      "wiki-fa",
      [950, 950, 900],
    );

    expect(ranks.get(950)).toBe(1);
    expect(ranks.get(900)).toBe(2);
  });
});
