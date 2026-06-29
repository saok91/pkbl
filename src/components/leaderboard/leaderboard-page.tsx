"use client";

import { useMemo, useState } from "react";

import {
  DEFAULT_CORPUS_PRESET_ID,
  type CorpusPresetId,
} from "@/lib/corpus/client-presets";
import type { LeaderboardEntry } from "@/lib/leaderboard/types";
import { api } from "~/trpc/react";

import { LeaderboardPresetFilter } from "./leaderboard-preset-filter";
import { LeaderboardTable } from "./leaderboard-table";

const PAGE_SIZE = 20;

export function LeaderboardPageContent() {
  const [presetId, setPresetId] =
    useState<CorpusPresetId>(DEFAULT_CORPUS_PRESET_ID);

  const query = api.leaderboard.list.useInfiniteQuery(
    { corpusPresetId: presetId, limit: PAGE_SIZE },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.success) {
          return undefined;
        }
        return lastPage.meta?.cursor ?? undefined;
      },
    },
  );

  const entries = useMemo(() => {
    if (!query.data) {
      return [] as LeaderboardEntry[];
    }

    return query.data.pages.flatMap((page) =>
      page.success && page.data ? page.data : [],
    );
  }, [query.data]);

  const total = query.data?.pages[0]?.meta?.total ?? null;
  const errorMessage =
    query.error?.message ??
    (query.data?.pages.some((page) => !page.success)
      ? "بارگذاری جدول امتیازات ناموفق بود."
      : null);

  return (
    <div className="space-y-6">
      <LeaderboardPresetFilter value={presetId} onChange={setPresetId} />

      {total !== null ? (
        <p className="text-sm text-text-dim">
          {total > 0
            ? `${total} چیدمان ثبت‌شده — مرتب‌سازی: امتیاز نزولی`
            : "هنوز چیدمانی برای این corpus ثبت نشده."}
        </p>
      ) : null}

      <LeaderboardTable
        entries={entries}
        isLoading={query.isLoading}
        errorMessage={errorMessage}
      />

      {query.hasNextPage ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => void query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
            className="rounded-lg border border-border-strong bg-surface-panel px-4 py-2 text-sm text-text-secondary enabled:hover:bg-[#0C1E38] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {query.isFetchingNextPage ? "در حال بارگذاری…" : "صفحهٔ بعد"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
