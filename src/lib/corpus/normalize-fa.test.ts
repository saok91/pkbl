import { describe, expect, it } from "vitest";

import {
  DEFAULT_NORMALIZATION_CONFIG,
  NORMALIZATION_CONFIG_V1,
} from "./config";
import { normalizePersianText } from "./normalize-fa";

describe("normalizePersianText", () => {
  it("exposes normalizedVersion from config", () => {
    const result = normalizePersianText("سلام");
    expect(result.normalizedVersion).toBe(
      NORMALIZATION_CONFIG_V1.normalizedVersion,
    );
  });

  it("unifies Arabic/Persian letter variants (ی/ي، ک/ك، ة/ه)", () => {
    const result = normalizePersianText("مركزي");
    expect(result.text).toBe("مرکزی");
  });

  it("removes unnecessary zero-width chars but keeps ZWNJ", () => {
    const zwnj = "\u200c";
    const input = `پیش${zwnj}نویس\u200b\u200d\uFEFF`;
    const result = normalizePersianText(input);
    expect(result.text).toBe(`پیش${zwnj}نویس`);
  });

  it("normalizes whitespace and nbsp", () => {
    const result = normalizePersianText("سلام\u00A0\u2003\u2003\u2003دنیا");
    expect(result.text).toBe("سلام دنیا");
  });

  it("converts Persian digits to Latin by default", () => {
    const result = normalizePersianText("سال ۱۴۰۳");
    expect(result.text).toBe("سال 1403");
  });

  it("handles mixed Persian and Latin numerals", () => {
    const result = normalizePersianText("سال ۱۴۰۳ و 2024");
    expect(result.text).toBe("سال 1403 و 2024");
  });

  it("preserves digits when digitPolicy is preserve", () => {
    const result = normalizePersianText("۱۴۰۳", {
      ...DEFAULT_NORMALIZATION_CONFIG,
      digitPolicy: "preserve",
    });
    expect(result.text).toBe("۱۴۰۳");
  });

  it("normalizes formal Persian punctuation spacing", () => {
    const result = normalizePersianText("سلام،  دنیا ؛  خداحافظ");
    expect(result.text).toBe("سلام، دنیا؛ خداحافظ");
  });

  it("handles colloquial sports-style text", () => {
    const result = normalizePersianText(
      "این تیمایی که ژاپن داره می بره رو قطر هم می تونه ببره🤣🤣",
    );
    expect(result.text).toBe(
      "این تیمایی که ژاپن داره می بره رو قطر هم می تونه ببره🤣🤣",
    );
  });
});
