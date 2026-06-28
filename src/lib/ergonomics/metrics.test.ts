import { describe, expect, it } from "vitest";

import { getDefaultTemplate } from "@/lib/layout";
import {
  DEFAULT_ERGONOMICS_CONFIG,
  SPACEBAR_KEY_ID,
  buildKeyMetricsMap,
  getKeyMetrics,
} from "./index";

describe("getKeyMetrics", () => {
  it("assigns zero reach penalty on home row", () => {
    const fKey = getKeyMetrics("R2C4");
    expect(fKey.row).toBe("home");
    expect(fKey.reachPenalty).toBe(0);
  });

  it("assigns higher reach penalty on number row", () => {
    const oneKey = getKeyMetrics("R0C1");
    expect(oneKey.row).toBe("number");
    expect(oneKey.reachPenalty).toBe(
      DEFAULT_ERGONOMICS_CONFIG.rowReachPenalty.number,
    );
  });

  it("assigns higher weakKeyPenalty to pinky than index", () => {
    const qKey = getKeyMetrics("R1C1");
    const eKey = getKeyMetrics("R1C3");
    expect(qKey.finger).toBe("pinky");
    expect(eKey.finger).toBe("middle");
    expect(qKey.weakKeyPenalty).toBeGreaterThan(eKey.weakKeyPenalty);
  });

  it("adds outer-column penalty to pinky edge keys", () => {
    const qKey = getKeyMetrics("R1C1");
    const tKey = getKeyMetrics("R1C5");
    expect(qKey.finger).toBe("pinky");
    expect(tKey.finger).toBe("index");
    expect(qKey.weakKeyPenalty).toBeGreaterThan(
      DEFAULT_ERGONOMICS_CONFIG.fingerWeakPenalty.pinky,
    );
  });

  it("uses dedicated thumb penalty for spacebar", () => {
    const space = getKeyMetrics(SPACEBAR_KEY_ID);
    const alt = getKeyMetrics("R4C2");
    expect(space.finger).toBe("thumb");
    expect(space.weakKeyPenalty).toBe(
      DEFAULT_ERGONOMICS_CONFIG.thumbSpacePenalty,
    );
    expect(alt.weakKeyPenalty).toBe(
      DEFAULT_ERGONOMICS_CONFIG.thumbModifierPenalty,
    );
    expect(space.weakKeyPenalty).toBeLessThan(alt.weakKeyPenalty);
  });

  it("builds metrics map for all template keys", () => {
    const layout = getDefaultTemplate();
    const keyIds = [...layout.keys.keys()];
    const metricsMap = buildKeyMetricsMap(keyIds);
    expect(metricsMap.size).toBe(keyIds.length);
    for (const keyId of keyIds) {
      expect(metricsMap.get(keyId)).toBeDefined();
    }
  });

  it("respects custom ergonomics config", () => {
    const customConfig = {
      ...DEFAULT_ERGONOMICS_CONFIG,
      version: 99,
      rowReachPenalty: {
        home: 0,
        top: 1,
        bottom: 2,
        number: 3,
      },
    };
    const topKey = getKeyMetrics("R1C1", customConfig);
    expect(topKey.reachPenalty).toBe(1);
  });
});

describe("penalty ordering", () => {
  it("ranks pinky outer keys worse than index home keys", () => {
    const pinkyTop = getKeyMetrics("R1C1");
    const indexHome = getKeyMetrics("R2C4");
    const totalPinky =
      pinkyTop.reachPenalty + pinkyTop.weakKeyPenalty;
    const totalIndex =
      indexHome.reachPenalty + indexHome.weakKeyPenalty;
    expect(totalPinky).toBeGreaterThan(totalIndex);
  });
});
