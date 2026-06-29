import { TRPCError } from "@trpc/server";

export type RateLimitConfig = {
  readonly limit: number;
  readonly windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

/** In-memory sliding-window limiter (single Node process). */
export class InMemoryRateLimiter {
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

  /** Test helper — clears all buckets. */
  clear(): void {
    this.buckets.clear();
  }
}

export const apiRateLimiter = new InMemoryRateLimiter();

export const RATE_LIMITS = {
  score: { limit: 60, windowMs: 60_000 },
  corpusAnalyze: { limit: 30, windowMs: 60_000 },
  leaderboardSubmit: { limit: 5, windowMs: 60 * 60_000 },
} as const;

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export function assertRateLimit(
  key: string,
  config: RateLimitConfig,
  limiter: InMemoryRateLimiter = apiRateLimiter,
): void {
  if (!limiter.consume(key, config)) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded. Please try again later.",
    });
  }
}
