import { describe, expect, it } from "vitest";

import { toPersianDigits } from "./config";

describe("toPersianDigits", () => {
  it("maps Latin digits to Persian", () => {
    expect(toPersianDigits("0")).toBe("۰");
    expect(toPersianDigits("123")).toBe("۱۲۳");
    expect(toPersianDigits("score: 917")).toBe("score: ۹۱۷");
  });

  it("leaves Persian digits and non-digits unchanged", () => {
    expect(toPersianDigits("۰۱۲")).toBe("۰۱۲");
    expect(toPersianDigits("ا")).toBe("ا");
  });
});
