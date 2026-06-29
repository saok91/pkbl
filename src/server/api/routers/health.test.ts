import { describe, expect, it } from "vitest";

import { createCallerFactory } from "~/server/api/trpc";
import { healthRouter } from "~/server/api/routers/health";

const createHealthCaller = createCallerFactory(healthRouter);

describe("health router", () => {
  it("returns ok with echo payload", async () => {
    const caller = createHealthCaller({
      db: {} as never,
      clientIp: "test-health",
      headers: new Headers(),
    });

    const result = await caller.ping({ echo: "test" });

    expect(result).toEqual({
      ok: true,
      app: "pkbl",
      echo: "test",
    });
  });

  it("exports ping procedure", () => {
    expect(healthRouter._def.procedures).toHaveProperty("ping");
  });
});
