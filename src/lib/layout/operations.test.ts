import { describe, expect, it } from "vitest";

import { EDITABLE_CHARSET } from "./editable-scope";
import { getBlankAnsiTemplate, getDefaultTemplate } from "./kle-parser";
import {
  assignChar,
  getAssignedCharsForLayer,
  resetAllEditable,
  resetKey,
  swapKeys,
} from "./operations";
import { keyIdAt } from "./test-utils";
import { LayoutError } from "./types";

describe("assignChar", () => {
  it("assigns character immutably", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");

    const updated = assignChar(layout, qKey, "base", "ق");
    expect(updated.assignments.get(qKey)?.base).toBe("ق");
    expect(layout.assignments.get(qKey)?.base).toBe("ض");
  });

  it("rejects char outside editable scope", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");

    expect(() => assignChar(layout, qKey, "base", "😀")).toThrow(LayoutError);
  });

  it("rejects multi-code-point strings", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");

    expect(() => assignChar(layout, qKey, "base", "ab")).toThrow(LayoutError);
  });

  it("rejects assign on modifier key", () => {
    const layout = getDefaultTemplate();
    expect(() => assignChar(layout, "R1C0", "base", "ا")).toThrow(LayoutError);
  });
});

describe("swapKeys", () => {
  it("swaps both layers when layer omitted", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");
    const wKey = keyIdAt("W");

    const withQ = assignChar(layout, qKey, "base", "ق");
    const withW = assignChar(withQ, wKey, "base", "و");
    const swapped = swapKeys(withW, qKey, wKey);

    expect(swapped.assignments.get(qKey)?.base).toBe("و");
    expect(swapped.assignments.get(wKey)?.base).toBe("ق");
  });

  it("swaps single layer when specified", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");
    const wKey = keyIdAt("W");

    const withShift = assignChar(layout, qKey, "shift", "ق");
    const withWShift = assignChar(withShift, wKey, "shift", "و");
    const swapped = swapKeys(withWShift, qKey, wKey, "shift");

    expect(swapped.assignments.get(qKey)?.shift).toBe("و");
    expect(swapped.assignments.get(wKey)?.shift).toBe("ق");
    expect(swapped.assignments.get(qKey)?.base).toBe("ض");
  });

  it("rejects swap on modifier key", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");

    expect(() => swapKeys(layout, qKey, "R1C0")).toThrow(LayoutError);
  });
});

describe("resetKey", () => {
  it("resets key to template default", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");

    const assigned = assignChar(layout, qKey, "base", "ق");
    const reset = resetKey(assigned, qKey);
    expect(reset.assignments.get(qKey)?.base).toBe("ض");
  });

  it("resets only base layer when layer specified", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");

    const withBase = assignChar(layout, qKey, "base", "ق");
    const withShift = assignChar(withBase, qKey, "shift", "و");
    const reset = resetKey(withShift, qKey, "base");

    expect(reset.assignments.get(qKey)?.base).toBe("ض");
    expect(reset.assignments.get(qKey)?.shift).toBe("و");
  });
});

describe("resetAllEditable", () => {
  it("resets all editable keys", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");
    const wKey = keyIdAt("W");

    let current = assignChar(layout, qKey, "base", "ق");
    current = assignChar(current, wKey, "base", "و");
    const reset = resetAllEditable(current);

    expect(reset.assignments.get(qKey)?.base).toBe("ض");
    expect(reset.assignments.get(wKey)?.base).toBe("ص");
  });
});

describe("getAssignedCharsForLayer", () => {
  it("reads base and shift slots separately", () => {
    const layout = getDefaultTemplate();
    const qKey = keyIdAt("Q");
    const wKey = keyIdAt("W");

    const updated = assignChar(
      assignChar(layout, qKey, "base", "ق"),
      wKey,
      "shift",
      "ث",
    );

    expect(getAssignedCharsForLayer(updated, "base")).toContain("ق");
    expect(getAssignedCharsForLayer(updated, "shift")).toContain("ث");

    for (const char of getAssignedCharsForLayer(updated, "base")) {
      const foundOnBase = [...updated.assignments.entries()].some(
        ([keyId, slot]) =>
          updated.keys.get(keyId)?.isEditable && slot.base === char,
      );
      expect(foundOnBase).toBe(true);
    }

    for (const char of getAssignedCharsForLayer(updated, "shift")) {
      const foundOnShift = [...updated.assignments.entries()].some(
        ([keyId, slot]) =>
          updated.keys.get(keyId)?.isEditable && slot.shift === char,
      );
      expect(foundOnShift).toBe(true);
    }
  });
});

describe("EditableScope", () => {
  it("includes Persian letters in charset", () => {
    expect(EDITABLE_CHARSET).toContain("ا");
    expect(EDITABLE_CHARSET).toContain("ی");
  });

  it("spacebar key is editable", () => {
    const layout = getDefaultTemplate();
    expect(layout.keys.get("R4C3")?.isEditable).toBe(true);
  });
});
