import { describe, expect, it } from "vitest";

import { apiFail, apiOk } from "~/server/api/result";

describe("ApiResult envelope", () => {
  it("creates success envelope", () => {
    expect(apiOk({ value: 1 })).toEqual({
      success: true,
      data: { value: 1 },
      error: null,
    });
  });

  it("creates failure envelope", () => {
    expect(apiFail("boom")).toEqual({
      success: false,
      data: null,
      error: "boom",
    });
  });

  it("includes optional meta", () => {
    expect(apiOk([], { limit: 20, total: 0 })).toEqual({
      success: true,
      data: [],
      error: null,
      meta: { limit: 20, total: 0 },
    });
  });
});
