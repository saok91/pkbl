import { describe, expect, it } from "vitest";

import { TRPCError } from "@trpc/server";

import {
  apiRateLimiter,
  assertRateLimit,
  DbRateLimiter,
  getClientIp,
  InMemoryRateLimiter,
} from "~/server/api/rate-limit";

describe("getClientIp", () => {
  it("returns unknown when proxy headers are not trusted", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.1, 70.41.3.18",
    });

    expect(getClientIp(headers)).toBe("unknown");
  });

  it("reads first x-forwarded-for address when proxy is trusted", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.1, 70.41.3.18",
    });

    expect(getClientIp(headers, { trustProxy: true })).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip when trusted", () => {
    const headers = new Headers({ "x-real-ip": "198.51.100.1" });

    expect(getClientIp(headers, { trustProxy: true })).toBe("198.51.100.1");
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

describe("DbRateLimiter", () => {
  it("persists bucket state through prisma transaction", async () => {
    const buckets = new Map<
      string,
      { key: string; count: number; resetAt: Date }
    >();

    const db = {
      $transaction: async (callback: (tx: unknown) => Promise<boolean>) =>
        callback({
          rateLimitBucket: {
            findUnique: async ({ where }: { where: { key: string } }) =>
              buckets.get(where.key) ?? null,
            upsert: async ({
              where,
              create,
              update,
            }: {
              where: { key: string };
              create: { key: string; count: number; resetAt: Date };
              update: { count: number; resetAt: Date };
            }) => {
              const next = buckets.has(where.key)
                ? { key: where.key, ...update }
                : create;
              buckets.set(where.key, next);
              return next;
            },
            update: async ({
              where,
              data,
            }: {
              where: { key: string };
              data: { count: number };
            }) => {
              const current = buckets.get(where.key);
              if (!current) {
                throw new Error("missing bucket");
              }
              const next = { ...current, count: data.count };
              buckets.set(where.key, next);
              return next;
            },
          },
        }),
    };

    const limiter = new DbRateLimiter(db as never);
    const config = { limit: 2, windowMs: 60_000 };

    expect(await limiter.consume("db-key", config)).toBe(true);
    expect(await limiter.consume("db-key", config)).toBe(true);
    expect(await limiter.consume("db-key", config)).toBe(false);
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
