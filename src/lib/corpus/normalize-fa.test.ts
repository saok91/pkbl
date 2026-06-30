import { describe, expect, it } from "vitest";

import {
  DEFAULT_NORMALIZATION_CONFIG,
  NORMALIZATION_CONFIG_V1,
  NORMALIZATION_CONFIG_V2,
} from "./config";
import { normalizePersianText } from "./normalize-fa";

describe("normalizePersianText", () => {
  it("exposes normalizedVersion from config", () => {
    const result = normalizePersianText("سلام");
    expect(result.normalizedVersion).toBe(
      NORMALIZATION_CONFIG_V1.normalizedVersion,
    );
  });

  it("unifies Arabic/Persian letter variants in v1 (ی/ي، ک/ك، ة/ه)", () => {
    const result = normalizePersianText("مركزي", NORMALIZATION_CONFIG_V1);
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

  it("does not map Latin punctuation in v1", () => {
    const result = normalizePersianText(
      "سلام, دنیا; واقعا?",
      NORMALIZATION_CONFIG_V1,
    );
    expect(result.text).toBe("سلام, دنیا; واقعا?");
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

describe("normalizePersianText with NORMALIZATION_CONFIG_V2 (E16-S1)", () => {
  const v2 = NORMALIZATION_CONFIG_V2;

  it("exposes fa-normalize-v2 normalizedVersion", () => {
    const result = normalizePersianText("سلام", v2);
    expect(result.normalizedVersion).toBe("fa-normalize-v2");
  });

  it("unifies only ي→ی and ك→ک (not ى or ة)", () => {
    expect(normalizePersianText("مركزي", v2).text).toBe("مرکزی");
    expect(normalizePersianText("\u0649", v2).text).toBe("\u0649");
    expect(normalizePersianText("\u0629", v2).text).toBe("\u0629");
  });

  it("preserves آ أ إ separately from ا", () => {
    expect(normalizePersianText("آأإا", v2).text).toBe("آأإا");
  });

  it("preserves ئ separately from ی", () => {
    expect(normalizePersianText("\u0626\u06CC", v2).text).toBe("\u0626\u06CC");
  });

  it("converts Latin digits to Persian by default", () => {
    expect(normalizePersianText("سال 1403", v2).text).toBe("سال ۱۴۰۳");
    expect(normalizePersianText("سال ۱۴۰۳ و 2024", v2).text).toBe(
      "سال ۱۴۰۳ و ۲۰۲۴",
    );
  });

  it("maps Latin punctuation to Persian keyboard forms", () => {
    expect(normalizePersianText("سلام, دنیا; واقعا?", v2).text).toBe(
      "سلام، دنیا؛ واقعا؟",
    );
  });

  it("leaves Persian punctuation unchanged", () => {
    expect(normalizePersianText("سلام، دنیا؛ واقعا؟", v2).text).toBe(
      "سلام، دنیا؛ واقعا؟",
    );
  });

  it("leaves period unchanged", () => {
    expect(normalizePersianText("پایان.", v2).text).toBe("پایان.");
  });
});
