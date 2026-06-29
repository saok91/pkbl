import { describe, expect, it, vi } from "vitest";

import { getDefaultTemplate } from "@/lib/layout/kle-parser";
import { PERSIAN_STANDARD_60_ID } from "@/lib/layout/persian-standard-60";

import { layoutAsWireInput } from "~/server/api/test-utils/layout-wire";
import { apiRateLimiter } from "~/server/api/rate-limit";
import { createCallerFactory } from "~/server/api/trpc";
import { leaderboardRouter } from "~/server/api/routers/leaderboard";

const createLeaderboardCaller = createCallerFactory(leaderboardRouter);

function createMockDb(overrides: Partial<Record<string, unknown>> = {}) {
  const db = {
    layoutRecord: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        id: "layout-1",
        fingerprint: "fp-1",
        alias: "test",
        createdAt: new Date("2026-01-01"),
      }),
    },
    scoreSnapshot: {
      findFirst: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn().mockResolvedValue({
        id: "score-1",
        totalScore: 950,
      }),
    },
    keyboardTemplate: {
      findFirst: vi.fn().mockResolvedValue({ id: "tmpl-1" }),
      findMany: vi.fn().mockResolvedValue([]),
    },
    $transaction: vi.fn(),
    ...overrides,
  };

  db.$transaction.mockImplementation(
    async (callback: (tx: typeof db) => Promise<unknown>) => callback(db),
  );

  return db;
}

function createCaller(db: ReturnType<typeof createMockDb>) {
  return createLeaderboardCaller({
    db: db as never,
    clientIp: "test-leaderboard",
    headers: new Headers(),
  });
}

describe("leaderboard router", () => {
  it("lists leaderboard entries for a preset with global rank and total", async () => {
    const db = createMockDb({
      scoreSnapshot: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "score-1",
            totalScore: 950,
            corpusPresetId: "wiki-fa",
            layout: {
              fingerprint: "fp-1",
              alias: "alpha",
              createdAt: new Date("2026-01-01"),
            },
          },
        ]),
        count: vi.fn().mockResolvedValue(42),
      },
    });

    const caller = createCaller(db);

    const result = await caller.list({ corpusPresetId: "wiki-fa", limit: 20 });

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0]?.rank).toBe(1);
    expect(result.data?.[0]?.alias).toBe("alpha");
    expect(result.meta?.total).toBe(42);
  });

  it("paginates with offset cursor and preserves rank offset", async () => {
    const db = createMockDb({
      scoreSnapshot: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "score-2",
            totalScore: 900,
            corpusPresetId: "wiki-fa",
            layout: {
              fingerprint: "fp-2",
              alias: "beta",
              createdAt: new Date("2026-01-02"),
            },
          },
        ]),
        count: vi.fn().mockResolvedValue(2),
      },
    });

    const caller = createCaller(db);

    const result = await caller.list({
      corpusPresetId: "wiki-fa",
      limit: 1,
      cursor: "1",
    });

    expect(result.success).toBe(true);
    expect(result.data?.[0]?.rank).toBe(2);
    expect(db.scoreSnapshot.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 1, take: 2 }),
    );
  });

  it("accepts first submit when no prior entries exist", async () => {
    apiRateLimiter.clear();
    const db = createMockDb({
      scoreSnapshot: {
        findFirst: vi.fn().mockResolvedValue(null),
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
        create: vi.fn().mockResolvedValue({
          id: "score-1",
          totalScore: 950,
        }),
      },
    });

    const caller = createCaller(db);

    const result = await caller.submit({
      layout: layoutAsWireInput(getDefaultTemplate()),
      corpusPresetId: "wiki-fa",
      alias: "my-layout",
    });

    expect(result.success).toBe(true);
    expect(result.data?.accepted).toBe(true);
    expect(result.data?.reason).toBe("first_entry");
    expect(db.layoutRecord.create).toHaveBeenCalledOnce();
    expect(db.scoreSnapshot.create).toHaveBeenCalledOnce();
  });

  it("resolves legacy persian-standard-60 template slug", async () => {
    apiRateLimiter.clear();
    const db = createMockDb({
      scoreSnapshot: {
        findFirst: vi.fn().mockResolvedValue(null),
        count: vi.fn().mockResolvedValue(0),
        create: vi.fn().mockResolvedValue({
          id: "score-1",
          totalScore: 950,
        }),
      },
    });

    const caller = createCaller(db);
    const layout = getDefaultTemplate();
    const legacyLayout = {
      ...layout,
      templateId: PERSIAN_STANDARD_60_ID,
    };

    const result = await caller.submit({
      layout: layoutAsWireInput(legacyLayout),
      corpusPresetId: "wiki-fa",
    });

    expect(result.success).toBe(true);
    expect(result.data?.accepted).toBe(true);
    expect(db.keyboardTemplate.findFirst).toHaveBeenCalledWith({
      where: { slug: "template-60-ansi" },
    });
  });

  it("rejects submit when score is not better than current best", async () => {
    apiRateLimiter.clear();
    const db = createMockDb({
      scoreSnapshot: {
        findFirst: vi.fn().mockResolvedValue({ totalScore: 9999 }),
        count: vi.fn(),
        create: vi.fn(),
      },
    });

    const caller = createCaller(db);

    const result = await caller.submit({
      layout: layoutAsWireInput(getDefaultTemplate()),
      corpusPresetId: "wiki-fa",
    });

    expect(result.success).toBe(true);
    expect(result.data?.accepted).toBe(false);
    expect(result.data?.reason).toBe("score_too_low");
    expect(db.layoutRecord.create).not.toHaveBeenCalled();
  });

  it("rejects duplicate fingerprint", async () => {
    apiRateLimiter.clear();
    const db = createMockDb({
      layoutRecord: {
        findUnique: vi.fn().mockResolvedValue({ id: "existing" }),
        create: vi.fn(),
      },
    });

    const caller = createCaller(db);

    const result = await caller.submit({
      layout: layoutAsWireInput(getDefaultTemplate()),
      corpusPresetId: "wiki-fa",
    });

    expect(result.success).toBe(true);
    expect(result.data?.accepted).toBe(false);
    expect(result.data?.reason).toBe("duplicate");
  });

  it("returns empty community templates by default", async () => {
    const db = createMockDb();

    const caller = createCaller(db);

    const result = await caller.templates();

    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it("exports list, submit, and templates procedures", () => {
    expect(leaderboardRouter._def.procedures).toHaveProperty("list");
    expect(leaderboardRouter._def.procedures).toHaveProperty("submit");
    expect(leaderboardRouter._def.procedures).toHaveProperty("templates");
  });
});
