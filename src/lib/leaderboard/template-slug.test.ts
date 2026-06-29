import { describe, expect, it } from "vitest";

import { PERSIAN_STANDARD_60_ID } from "@/lib/layout/persian-standard-60";
import { TEMPLATE_60_ANSI_ID } from "@/lib/layout/template-60-ansi";

import { resolveKeyboardTemplateSlug } from "./template-slug";

describe("resolveKeyboardTemplateSlug", () => {
  it("maps legacy persian-standard-60 to template-60-ansi", () => {
    expect(resolveKeyboardTemplateSlug(PERSIAN_STANDARD_60_ID)).toBe(
      TEMPLATE_60_ANSI_ID,
    );
  });

  it("returns canonical slug unchanged", () => {
    expect(resolveKeyboardTemplateSlug(TEMPLATE_60_ANSI_ID)).toBe(
      TEMPLATE_60_ANSI_ID,
    );
  });
});
