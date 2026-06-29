import { describe, expect, it } from "vitest";

import {
  classifyFingerLoad,
  classifyMetric,
  ERGONOMIC_METRIC_BANDS,
  VERDICT_BANDS_V1,
} from "./metric-bands";

describe("classifyMetric", () => {
  it("classifies higher-is-better metrics at boundaries", () => {
    const band = ERGONOMIC_METRIC_BANDS.homeRowUsage;
    expect(classifyMetric(band.good, band)).toBe("good");
    expect(classifyMetric(band.ok, band)).toBe("ok");
    expect(classifyMetric(band.ok - 1, band)).toBe("poor");
  });

  it("classifies lower-is-better metrics at boundaries", () => {
    const band = ERGONOMIC_METRIC_BANDS.weakKeyPenalty;
    expect(classifyMetric(band.good, band)).toBe("good");
    expect(classifyMetric(band.ok, band)).toBe("ok");
    expect(classifyMetric(band.ok + 1, band)).toBe("poor");
  });
});

describe("classifyFingerLoad", () => {
  it("uses lower threshold for pinky", () => {
    expect(classifyFingerLoad(0.14, "pinky")).toBe("good");
    expect(classifyFingerLoad(0.14, "default")).toBe("good");
    expect(classifyFingerLoad(0.25, "pinky")).toBe("poor");
    expect(classifyFingerLoad(0.25, "default")).toBe("ok");
  });
});

describe("VERDICT_BANDS_V1", () => {
  it("is versioned", () => {
    expect(VERDICT_BANDS_V1.version).toBe("1");
    expect(VERDICT_BANDS_V1.goodMinRatio).toBeGreaterThan(
      VERDICT_BANDS_V1.okMinRatio,
    );
  });
});
