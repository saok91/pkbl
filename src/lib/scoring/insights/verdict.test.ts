import { describe, expect, it } from "vitest";

import { VERDICT_BANDS_V1 } from "./metric-bands";
import { deriveVerdict, deriveVerdictBand } from "./verdict";

describe("deriveVerdictBand", () => {
  it("maps ratio to band deterministically at boundaries", () => {
    expect(deriveVerdictBand(VERDICT_BANDS_V1.goodMinRatio)).toBe("good");
    expect(deriveVerdictBand(VERDICT_BANDS_V1.goodMinRatio - 0.001)).toBe("ok");
    expect(deriveVerdictBand(VERDICT_BANDS_V1.okMinRatio)).toBe("ok");
    expect(deriveVerdictBand(VERDICT_BANDS_V1.okMinRatio - 0.001)).toBe("poor");
  });
});

describe("deriveVerdict", () => {
  it("returns Persian label and ratio", () => {
    const verdict = deriveVerdict(1030, 1000);
    expect(verdict.band).toBe("good");
    expect(verdict.labelFa).toBe("چیدمان خوب");
    expect(verdict.ratioToBaseline).toBeCloseTo(1.03);
  });

  it("handles zero baseline gracefully", () => {
    const verdict = deriveVerdict(500, 0);
    expect(verdict.ratioToBaseline).toBe(1);
    expect(verdict.band).toBe("ok");
  });
});
