import { describe, expect, it } from "vitest";

import { getDefaultTemplate } from "@/lib/layout";
import { OUTER_COLUMN_KEY_IDS } from "./config";
import {
  FINGER_MAP_60_KEY_IDS,
  FINGER_MAP_60_TEMPLATE_ID,
  getFingerAssignment,
  getFingerMap60,
  isFingerMapComplete,
} from "./finger-map-60";

describe("finger-map-60", () => {
  it("targets the default 60% ANSI template", () => {
    expect(FINGER_MAP_60_TEMPLATE_ID).toBe("template-60-ansi");
  });

  it("covers every key in the default template", () => {
    const layout = getDefaultTemplate();
    const templateKeyIds = [...layout.keys.keys()].sort();
    expect(isFingerMapComplete(templateKeyIds)).toBe(true);
    expect(FINGER_MAP_60_KEY_IDS.length).toBe(templateKeyIds.length);
  });

  it("maps home row letters to standard touch-typing fingers", () => {
    expect(getFingerAssignment("R2C1")).toEqual({
      finger: "pinky",
      hand: "left",
      row: "home",
    });
    expect(getFingerAssignment("R2C4")).toEqual({
      finger: "index",
      hand: "left",
      row: "home",
    });
    expect(getFingerAssignment("R2C7")).toEqual({
      finger: "index",
      hand: "right",
      row: "home",
    });
    expect(getFingerAssignment("R2C10")).toEqual({
      finger: "pinky",
      hand: "right",
      row: "home",
    });
  });

  it("maps spacebar to thumb", () => {
    expect(getFingerAssignment("R4C3")).toEqual({
      finger: "thumb",
      hand: "left",
      row: "bottom",
    });
  });

  it("returns a frozen finger map", () => {
    const map = getFingerMap60();
    expect(Object.isFrozen(map)).toBe(true);
    expect(() => {
      (map as Record<string, unknown>).R0C0 = {};
    }).toThrow();
  });

  it("throws for unknown keyId", () => {
    expect(() => getFingerAssignment("R9C9")).toThrow(/No finger assignment/);
  });

  it("maps every outer-column keyId to pinky", () => {
    for (const keyId of OUTER_COLUMN_KEY_IDS) {
      expect(getFingerAssignment(keyId).finger).toBe("pinky");
    }
  });
});
