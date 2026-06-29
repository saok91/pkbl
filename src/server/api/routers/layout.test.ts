import { describe, expect, it } from "vitest";

import { getDefaultTemplate } from "@/lib/layout/kle-parser";
import { PERSIAN_STANDARD_60_KLE } from "@/lib/layout/persian-standard-60";

import { layoutAsWireInput } from "~/server/api/test-utils/layout-wire";
import { createCallerFactory } from "~/server/api/trpc";
import { layoutRouter } from "~/server/api/routers/layout";

const createLayoutCaller = createCallerFactory(layoutRouter);

function createCaller() {
  return createLayoutCaller({
    db: {} as never,
    clientIp: "test-layout",
    headers: new Headers(),
  });
}

describe("layout router", () => {
  it("returns default 60% template", async () => {
    const caller = createCaller();

    const result = await caller.getDefaultTemplate();

    expect(result.success).toBe(true);
    expect(result.data?.templateId).toBe("template-60-ansi");
    expect(result.data?.assignments.size).toBeGreaterThan(0);
  });

  it("parses valid KLE", async () => {
    const caller = createCaller();

    const result = await caller.parseKle({
      raw: JSON.stringify(PERSIAN_STANDARD_60_KLE),
    });

    expect(result.success).toBe(true);
    expect(result.data?.keys.size).toBeGreaterThan(0);
  });

  it("serializes layout to KLE string", async () => {
    const caller = createCaller();
    const layout = layoutAsWireInput(getDefaultTemplate());

    const result = await caller.serialize({ layout });

    expect(result.success).toBe(true);
    expect(result.data?.kle).toContain("[");
  });

  it("returns stub suggestions until E11", async () => {
    const caller = createCaller();

    const result = await caller.suggestPlacements({
      layout: layoutAsWireInput(getDefaultTemplate()),
      unassigned: ["ث"],
    });

    expect(result.success).toBe(true);
    expect(result.data?.suggestions).toEqual([]);
  });

  it("exports all layout procedures", () => {
    expect(layoutRouter._def.procedures).toHaveProperty("getDefaultTemplate");
    expect(layoutRouter._def.procedures).toHaveProperty("parseKle");
    expect(layoutRouter._def.procedures).toHaveProperty("serialize");
    expect(layoutRouter._def.procedures).toHaveProperty("suggestPlacements");
  });
});
