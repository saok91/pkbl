import { describe, expect, it } from "vitest";

import { EDITABLE_CHARSET } from "./editable-scope";
import { buildPaletteSections, flattenPaletteSections } from "./palette-charset";

describe("buildPaletteSections", () => {
  it("groups Persian letters alphabetically first", () => {
    const sections = buildPaletteSections(EDITABLE_CHARSET);
    expect(sections[0]?.id).toBe("letters");
    expect(sections[0]?.chars.startsWith("ا")).toBe(true);
    expect(sections[0]?.chars).toContain("ی");
  });

  it("includes shift forms in a dedicated section", () => {
    const sections = buildPaletteSections(EDITABLE_CHARSET);
    const shift = sections.find((s) => s.id === "shift-letters");
    expect(shift?.chars).toContain("آ");
    expect(shift?.chars).toContain("ئ");
  });

  it("covers every assignable character exactly once", () => {
    const sections = buildPaletteSections(EDITABLE_CHARSET);
    const flat = flattenPaletteSections(sections);
    expect(flat.length).toBe(EDITABLE_CHARSET.length);
    expect(new Set(flat).size).toBe(EDITABLE_CHARSET.length);
    for (const char of EDITABLE_CHARSET) {
      expect(flat).toContain(char);
    }
  });

  it("orders letters alphabetically not keyboard order", () => {
    const sections = buildPaletteSections(EDITABLE_CHARSET);
    const letters = sections.find((s) => s.id === "letters")?.chars ?? "";
    expect(letters.indexOf("ش")).toBeLessThan(letters.indexOf("ض"));
  });
});
