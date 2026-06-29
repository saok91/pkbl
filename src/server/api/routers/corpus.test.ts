import { describe, expect, it } from "vitest";

import { clearCustomCorpusCache } from "@/lib/corpus/analyze-custom";

import { apiRateLimiter } from "~/server/api/rate-limit";
import { createCallerFactory } from "~/server/api/trpc";
import { corpusRouter } from "~/server/api/routers/corpus";

const createCorpusCaller = createCallerFactory(corpusRouter);

function createCaller() {
  return createCorpusCaller({
    db: {} as never,
    clientIp: "test-corpus",
    headers: new Headers(),
  });
}

describe("corpus router", () => {
  it("lists built-in presets", async () => {
    const caller = createCaller();

    const result = await caller.listPresets();

    expect(result.success).toBe(true);
    expect(result.data?.length).toBeGreaterThanOrEqual(2);
    expect(result.data?.some((preset) => preset.id === "wiki-fa")).toBe(true);
  });

  it("analyzes custom text server-side", async () => {
    apiRateLimiter.clear();
    clearCustomCorpusCache();
    const caller = createCaller();

    const result = await caller.analyzeCustom({ text: "سلام دنیا" });

    expect(result.success).toBe(true);
    expect(result.data?.corpusId).toBe("custom");
    expect(result.data?.charCount).toBeGreaterThan(0);
  });

  it("rejects empty custom text", async () => {
    apiRateLimiter.clear();
    const caller = createCaller();

    await expect(caller.analyzeCustom({ text: "" })).rejects.toThrow();
  });

  it("exports listPresets and analyzeCustom procedures", () => {
    expect(corpusRouter._def.procedures).toHaveProperty("listPresets");
    expect(corpusRouter._def.procedures).toHaveProperty("analyzeCustom");
  });
});
