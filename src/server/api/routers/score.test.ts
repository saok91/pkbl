import { describe, expect, it } from "vitest";

import { getDefaultTemplate } from "@/lib/layout/kle-parser";
import { loadPresetNgramStats } from "@/lib/corpus/load-artifact";

import { layoutAsWireInput } from "~/server/api/test-utils/layout-wire";
import { createCallerFactory } from "~/server/api/trpc";
import { scoreRouter } from "~/server/api/routers/score";
import { apiRateLimiter } from "~/server/api/rate-limit";

const createScoreCaller = createCallerFactory(scoreRouter);

function createCaller() {
  return createScoreCaller({
    db: {} as never,
    clientIp: "test-score",
    headers: new Headers(),
  });
}

describe("score router", () => {
  it("evaluates layout against preset corpus", async () => {
    apiRateLimiter.clear();
    const caller = createCaller();

    const layout = layoutAsWireInput(getDefaultTemplate());
    const result = await caller.evaluate({
      layout,
      corpusPresetId: "wiki-fa",
    });

    expect(result.success).toBe(true);
    expect(result.data).not.toBeNull();
    expect(result.data?.total).toBeTypeOf("number");
    expect(result.data?.scorerVersion).toBe("1.0.0");
  });

  it("returns error envelope for unknown preset", async () => {
    apiRateLimiter.clear();
    const caller = createCaller();

    const result = await caller.evaluate({
      layout: layoutAsWireInput(getDefaultTemplate()),
      corpusPresetId: "unknown-preset",
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Unknown corpus preset/);
  });

  it("compares multiple layouts and returns ranking", async () => {
    apiRateLimiter.clear();
    const caller = createCaller();

    const layout = layoutAsWireInput(getDefaultTemplate());
    const result = await caller.compare({
      layouts: [layout, layout],
      corpusPresetId: "wiki-fa",
    });

    expect(result.success).toBe(true);
    expect(result.data?.results).toHaveLength(2);
    expect(result.data?.ranking).toHaveLength(2);
  });

  it("supports custom text corpus fallback", async () => {
    apiRateLimiter.clear();
    const caller = createCaller();

    const result = await caller.evaluate({
      layout: layoutAsWireInput(getDefaultTemplate()),
      corpusPresetId: "wiki-fa",
      customText: "سلام دنیا",
    });

    expect(result.success).toBe(true);
    expect(result.data?.total).toBeTypeOf("number");
  });

  it("rejects compare with fewer than two layouts", async () => {
    apiRateLimiter.clear();
    const caller = createCaller();

    await expect(
      caller.compare({
        layouts: [layoutAsWireInput(getDefaultTemplate())],
        corpusPresetId: "wiki-fa",
      }),
    ).rejects.toThrow();
  });

  it("exports evaluate and compare procedures", () => {
    expect(scoreRouter._def.procedures).toHaveProperty("evaluate");
    expect(scoreRouter._def.procedures).toHaveProperty("compare");
  });
});

describe("score router integration with loadPresetNgramStats", () => {
  it("matches direct computeScore for wiki-fa preset", async () => {
    apiRateLimiter.clear();
    const caller = createCaller();
    const layout = getDefaultTemplate();
    const stats = loadPresetNgramStats("wiki-fa");
    const apiResult = await caller.evaluate({
      layout: layoutAsWireInput(layout),
      corpusPresetId: "wiki-fa",
    });

    expect(apiResult.success).toBe(true);
    expect(apiResult.data?.total).toBeTypeOf("number");
    expect(stats.totalChars).toBeGreaterThan(0);
  });
});
