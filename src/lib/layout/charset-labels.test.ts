import { describe, expect, it } from "vitest";

import {
  getCharDescription,
  getCharDisplayLabel,
  hasCustomCharLabel,
} from "./charset-labels";

describe("charset labels", () => {
  it("labels invisible spacing characters distinctly", () => {
    expect(getCharDisplayLabel("\u200c")).toBe("نیم‌فاصله");
    expect(getCharDisplayLabel("\u200d")).toBe("اتصال");
    expect(getCharDisplayLabel(" ")).toBe("فاصله");
    expect(hasCustomCharLabel("\u200c")).toBe(true);
  });

  it("returns the char itself for normal letters", () => {
    expect(getCharDisplayLabel("ق")).toBe("ق");
    expect(hasCustomCharLabel("ق")).toBe(false);
  });

  it("provides descriptions for spacing chars", () => {
    expect(getCharDescription("\u200c")).toContain("U+200C");
    expect(getCharDescription(" ")).toContain("Space");
  });
});
