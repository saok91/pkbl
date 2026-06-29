import { TRPCError } from "@trpc/server";

import type { PrismaClient } from "../../../generated/prisma";

export type RateLimitConfig = {
  readonly limit: number;
  readonly windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

export interface RateLimiter {
  consume(key: string, config: RateLimitConfig): boolean;
  clear(): void;
}

/** In-memory sliding-window limiter (single Node process / tests). */
export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  consume(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || now >= bucket.resetAt) {
      this.buckets.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      });
      return true;
    }

    if (bucket.count >= config.limit) {
      return false;
    }

    this.buckets.set(key, {
      count: bucket.count + 1,
      resetAt: bucket.resetAt,
    });
    return true;
  }

  clear(): void {
    this.buckets.clear();
  }
}

/** Postgres-backed limiter — safe across multiple app instances. */
export class DbRateLimiter {
  constructor(private readonly db: PrismaClient) {}

  async consume(key: string, config: RateLimitConfig): Promise<boolean> {
    const now = new Date();

    return this.db.$transaction(async (tx) => {
      const bucket = await tx.rateLimitBucket.findUnique({ where: { key } });

      if (!bucket || now >= bucket.resetAt) {
        await tx.rateLimitBucket.upsert({
          where: { key },
          create: {
            key,
            count: 1,
            resetAt: new Date(now.getTime() + config.windowMs),
          },
          update: {
            count: 1,
            resetAt: new Date(now.getTime() + config.windowMs),
          },
        });
        return true;
      }

      if (bucket.count >= config.limit) {
        return false;
      }

      await tx.rateLimitBucket.update({
        where: { key },
        data: { count: bucket.count + 1 },
      });
      return true;
    });
  }
}

export const apiRateLimiter = new InMemoryRateLimiter();

export const RATE_LIMITS = {
  score: { limit: 60, windowMs: 60_000 },
  corpusAnalyze: { limit: 30, windowMs: 60_000 },
  leaderboardSubmit: { limit: 5, windowMs: 60 * 60_000 },
} as const;

type GetClientIpOptions = {
  readonly trustProxy: boolean;
};

export function getClientIp(
  headers: Headers,
  options: GetClientIpOptions = { trustProxy: false },
): string {
  if (options.trustProxy) {
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0]?.trim() ?? "unknown";
    }

    const realIp = headers.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
  }

  return "unknown";
}

function throwRateLimitError(): never {
  throw new TRPCError({
    code: "TOO_MANY_REQUESTS",
    message: "Rate limit exceeded. Please try again later.",
  });
}

/** Sync limiter for unit tests and Vitest runs. */
export function assertRateLimit(
  key: string,
  config: RateLimitConfig,
  limiter: RateLimiter = apiRateLimiter,
): void {
  if (!limiter.consume(key, config)) {
    throwRateLimitError();
  }
}

/** Async limiter backed by Postgres (production multi-instance). */
export async function assertRateLimitDb(
  key: string,
  config: RateLimitConfig,
  db: PrismaClient,
): Promise<void> {
  const limiter = new DbRateLimiter(db);
  if (!(await limiter.consume(key, config))) {
    throwRateLimitError();
  }
}
