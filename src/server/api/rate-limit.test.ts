import { describe, expect, it } from "vitest";

import { TRPCError } from "@trpc/server";

import {
  apiRateLimiter,
  assertRateLimit,
  getClientIp,
  InMemoryRateLimiter,
} from "~/server/api/rate-limit";

describe("getClientIp", () => {
  it("reads first x-forwarded-for address", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.1, 70.41.3.18",
    });

    expect(getClientIp(headers)).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip", () => {
    const headers = new Headers({ "x-real-ip": "198.51.100.1" });

    expect(getClientIp(headers)).toBe("198.51.100.1");
  });
});

describe("InMemoryRateLimiter", () => {
  it("allows requests within limit", () => {
    const limiter = new InMemoryRateLimiter();
    const config = { limit: 2, windowMs: 60_000 };

    expect(limiter.consume("key", config)).toBe(true);
    expect(limiter.consume("key", config)).toBe(true);
    expect(limiter.consume("key", config)).toBe(false);
  });

  it("throws TRPCError when assertRateLimit fails", () => {
    const limiter = new InMemoryRateLimiter();
    const config = { limit: 1, windowMs: 60_000 };

    assertRateLimit("assert-key", config, limiter);

    expect(() => assertRateLimit("assert-key", config, limiter)).toThrow(
      TRPCError,
    );
  });
});

describe("apiRateLimiter", () => {
  it("can be cleared for test isolation", () => {
    apiRateLimiter.clear();
    expect(apiRateLimiter.consume("clear-test", { limit: 1, windowMs: 1000 })).toBe(
      true,
    );
    apiRateLimiter.clear();
    expect(
      apiRateLimiter.consume("clear-test", { limit: 1, windowMs: 1000 }),
    ).toBe(true);
  });
});
