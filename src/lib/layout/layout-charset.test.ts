import { describe, expect, it } from "vitest";

import { getDefaultTemplate } from "./kle-parser";
import { extractCharsetFromKle } from "./layout-charset";
import {
  PERSIAN_STANDARD_60_KLE,
  PERSIAN_STANDARD_60_NAME,
} from "./persian-standard-60";
import { EDITABLE_CHARSET, isCharInEditableScope } from "./editable-scope";
import { getCompletenessScore } from "./analysis";

describe("extractCharsetFromKle", () => {
  it("includes base and shift layers from Persian Standard", () => {
    const charset = extractCharsetFromKle(PERSIAN_STANDARD_60_KLE);

    expect(charset).toContain("ا");
    expect(charset).toContain("آ");
    expect(charset).toContain("ئ");
    expect(charset).toContain("ؤ");
    expect(charset).toContain("ء");
    expect(charset).toContain("ژ");
    expect(charset).toContain("۱");
    expect(charset).toContain("،");
    expect(charset).toContain("\u200c");
  });

  it("deduplicates characters while preserving first-seen order", () => {
    const charset = extractCharsetFromKle(PERSIAN_STANDARD_60_KLE);
    const chars = [...charset];
    expect(chars.length).toBe(new Set(chars).size);
    expect(chars.indexOf("ض")).toBeLessThan(chars.indexOf("ش"));
  });

  it("matches EDITABLE_CHARSET export", () => {
    expect(EDITABLE_CHARSET).toBe(extractCharsetFromKle(PERSIAN_STANDARD_60_KLE));
  });
});

describe("Persian Standard charset scope", () => {
  it("allows assigning shift-layer letters", () => {
    expect(isCharInEditableScope("آ")).toBe(true);
    expect(isCharInEditableScope("ئ")).toBe(true);
    expect(isCharInEditableScope("ة")).toBe(true);
  });

  it("covers default layout assignments", () => {
    const layout = getDefaultTemplate();
    expect(getCompletenessScore(layout)).toBe(100);
  });

  it("is derived from named layout", () => {
    expect(PERSIAN_STANDARD_60_NAME).toBe("Persian Standard");
    expect(EDITABLE_CHARSET.length).toBeGreaterThan(50);
  });
});
