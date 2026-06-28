import { describe, expect, it } from "vitest";

import { ERGONOMICS_CONFIG_V1 } from "@/lib/ergonomics";
import {
  DEFAULT_SCORING_CONFIG,
  SCORING_CONFIG_V1,
  getErgonomicsFromScoringConfig,
} from "./config";

describe("ScoringConfig", () => {
  it("embeds versioned ergonomics config", () => {
    expect(SCORING_CONFIG_V1.version).toBe(1);
    expect(SCORING_CONFIG_V1.ergonomics).toBe(ERGONOMICS_CONFIG_V1);
    expect(DEFAULT_SCORING_CONFIG).toBe(SCORING_CONFIG_V1);
  });

  it("resolves ergonomics from scoring config", () => {
    expect(getErgonomicsFromScoringConfig()).toBe(ERGONOMICS_CONFIG_V1);
  });
});
