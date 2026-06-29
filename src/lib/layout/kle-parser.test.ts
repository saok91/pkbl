import { describe, expect, it } from "vitest";

import {
  getBlankAnsiTemplate,
  getDefaultTemplate,
  layoutsEquivalent,
  parseKle,
  parseKleJson,
  parseLabelLayers,
  serializeKle,
} from "./kle-parser";
import {
  PERSIAN_STANDARD_60_ID,
  PERSIAN_STANDARD_60_KLE,
} from "./persian-standard-60";
import { TEMPLATE_60_ANSI_ID, TEMPLATE_60_ANSI_KLE } from "./template-60-ansi";
import { LayoutError } from "./types";

describe("parseLabelLayers", () => {
  it("splits shift and base from KLE label", () => {
    expect(parseLabelLayers("<\n,")).toEqual({ shift: "<", base: "," });
  });

  it("treats single-line label as base only", () => {
    expect(parseLabelLayers("Q")).toEqual({ shift: "", base: "Q" });
  });
});

describe("parseKle — 60% template", () => {
  it("parses Appendix A template without error", () => {
    const layout = getDefaultTemplate();
    expect(layout.templateId).toBe(TEMPLATE_60_ANSI_ID);
    expect(layout.keys.size).toBeGreaterThan(0);
  });

  it("loads Persian Standard as default layout", () => {
    const layout = getDefaultTemplate();
    expect(layout.assignments.get("R2C6")?.base).toBe("ا");
    expect(layout.assignments.get("R1C1")?.base).toBe("ض");
    expect(layout.assignments.get("R2C4")?.base).toBe("ب");
  });

  it("assigns stable row-col keyIds", () => {
    const layout = getDefaultTemplate();
    expect(layout.keys.has("R0C0")).toBe(true);
    expect(layout.keys.get("R1C1")?.defaultLabel).toBe("ْ\nض");
  });

  it("extracts shift layer from newline labels", () => {
    const layout = getDefaultTemplate();
    const commaKey = [...layout.assignments.entries()].find(
      ([, slot]) => slot.base === "و",
    );
    expect(commaKey?.[1].shift).toBe(">");
  });

  it("parses width modifiers on keys", () => {
    const layout = getDefaultTemplate();
    const backspace = layout.keys.get("R0C13");
    expect(backspace?.geometry.width).toBe(2);
  });

  it("parses alignment and width on spacebar", () => {
    const layout = getDefaultTemplate();
    const space = layout.keys.get("R4C3");
    expect(space?.geometry.width).toBe(6.25);
    expect(space?.geometry.alignment).toBe(7);
    expect(space?.isEditable).toBe(true);
  });

  it("marks modifier keys as non-editable", () => {
    const layout = getDefaultTemplate();
    expect(layout.keys.get("R1C0")?.isEditable).toBe(false);
    expect(layout.keys.get("R1C0")?.modifierLabel).toBe("Tab");
    expect(layout.keys.get("R3C0")?.modifierLabel).toBe("Shift");
  });
});

describe("serializeKle round-trip", () => {
  it("parse → serialize → parse is equivalent", () => {
    const original = getDefaultTemplate();
    const serialized = serializeKle(original);
    const reparsed = parseKle(serialized, TEMPLATE_60_ANSI_ID);
    expect(layoutsEquivalent(original, reparsed)).toBe(true);
  });

  it("round-trips blank ANSI template JSON structure", () => {
    const layout = parseKleJson(TEMPLATE_60_ANSI_KLE);
    const roundTrip = parseKle(serializeKle(layout));
    expect(layoutsEquivalent(layout, roundTrip)).toBe(true);
  });

  it("round-trips Persian Standard template JSON structure", () => {
    const layout = parseKleJson(
      PERSIAN_STANDARD_60_KLE,
      PERSIAN_STANDARD_60_ID,
    );
    const roundTrip = parseKle(serializeKle(layout), PERSIAN_STANDARD_60_ID);
    expect(layoutsEquivalent(layout, roundTrip)).toBe(true);
  });
});

describe("parseKle validation", () => {
  it("rejects invalid JSON", () => {
    expect(() => parseKle("not json")).toThrow(LayoutError);
  });

  it("rejects non-array root", () => {
    expect(() => parseKleJson({ rows: [] })).toThrow(LayoutError);
  });

  it("rejects unsupported KLE features", () => {
    expect(() => parseKleJson([[{ f: 1 }, "A"]])).toThrow(LayoutError);
  });

  it("rejects x/y position modifiers", () => {
    expect(() => parseKleJson([[{ x: 1 }, "A"]])).toThrow(LayoutError);
    expect(() => parseKleJson([[{ y: 1 }, "A"]])).toThrow(LayoutError);
  });

  it("parses height modifier on keys", () => {
    const layout = parseKleJson([[{ w: 1, h: 2 }, "A"]]);
    const key = layout.keys.get("R0C0");
    expect(key?.geometry.width).toBe(1);
    expect(key?.geometry.height).toBe(2);
  });
});

describe("import user KLE", () => {
  it("accepts pasted KLE with validation", () => {
    const custom = JSON.stringify([
      ["A", "B"],
      ["C", "D"],
    ]);
    const layout = parseKle(custom, "custom");
    expect(layout.keys.size).toBe(4);
  });
});
