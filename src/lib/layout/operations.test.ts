import { describe, expect, it } from "vitest";

import { EDITABLE_CHARSET } from "./editable-scope";
import { getDefaultTemplate } from "./kle-parser";
import { assignChar, resetAllEditable, resetKey, swapKeys } from "./operations";
import { findKeyIdByLabel } from "./test-utils";
import { LayoutError } from "./types";

describe("assignChar", () => {
  it("assigns character immutably", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");

    const updated = assignChar(layout, qKey, "base", "ق");
    expect(updated.assignments.get(qKey)?.base).toBe("ق");
    expect(layout.assignments.get(qKey)?.base).toBe("Q");
  });

  it("rejects char outside editable scope", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");

    expect(() => assignChar(layout, qKey, "base", "😀")).toThrow(LayoutError);
  });

  it("rejects multi-code-point strings", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");

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
    const qKey = findKeyIdByLabel(layout, "Q");
    const wKey = findKeyIdByLabel(layout, "W");

    const withQ = assignChar(layout, qKey, "base", "ق");
    const withW = assignChar(withQ, wKey, "base", "و");
    const swapped = swapKeys(withW, qKey, wKey);

    expect(swapped.assignments.get(qKey)?.base).toBe("و");
    expect(swapped.assignments.get(wKey)?.base).toBe("ق");
  });

  it("swaps single layer when specified", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");
    const wKey = findKeyIdByLabel(layout, "W");

    const withShift = assignChar(layout, qKey, "shift", "ق");
    const withWShift = assignChar(withShift, wKey, "shift", "و");
    const swapped = swapKeys(withWShift, qKey, wKey, "shift");

    expect(swapped.assignments.get(qKey)?.shift).toBe("و");
    expect(swapped.assignments.get(wKey)?.shift).toBe("ق");
    expect(swapped.assignments.get(qKey)?.base).toBe("Q");
  });

  it("rejects swap on modifier key", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");

    expect(() => swapKeys(layout, qKey, "R1C0")).toThrow(LayoutError);
  });
});

describe("resetKey", () => {
  it("resets key to template default", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");

    const assigned = assignChar(layout, qKey, "base", "ق");
    const reset = resetKey(assigned, qKey);
    expect(reset.assignments.get(qKey)?.base).toBe("Q");
  });

  it("resets only base layer when layer specified", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");

    const withBase = assignChar(layout, qKey, "base", "ق");
    const withShift = assignChar(withBase, qKey, "shift", "و");
    const reset = resetKey(withShift, qKey, "base");

    expect(reset.assignments.get(qKey)?.base).toBe("Q");
    expect(reset.assignments.get(qKey)?.shift).toBe("و");
  });
});

describe("resetAllEditable", () => {
  it("resets all editable keys", () => {
    const layout = getDefaultTemplate();
    const qKey = findKeyIdByLabel(layout, "Q");
    const wKey = findKeyIdByLabel(layout, "W");

    let current = assignChar(layout, qKey, "base", "ق");
    current = assignChar(current, wKey, "base", "و");
    const reset = resetAllEditable(current);

    expect(reset.assignments.get(qKey)?.base).toBe("Q");
    expect(reset.assignments.get(wKey)?.base).toBe("W");
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
