"use client";

import { formatScore } from "@/components/editor/analytics/format-analytics";
import type { LeaderboardEntry } from "@/lib/leaderboard/types";

import { formatLeaderboardDate } from "./format-leaderboard-date";

type LeaderboardTableProps = {
  readonly entries: readonly LeaderboardEntry[];
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
};

function rankDisplay(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return formatScore(rank);
}

export function LeaderboardTable({
  entries,
  isLoading,
  errorMessage,
}: LeaderboardTableProps) {
  if (isLoading && entries.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-text-dim">
        در حال بارگذاری جدول امتیازات…
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p
        className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent"
        role="alert"
      >
        {errorMessage}
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-border-strong bg-surface-panel px-6 py-12 text-center">
        <p className="text-base font-medium text-text-secondary">
          هنوز چیدمانی ثبت نشده
        </p>
        <p className="mt-2 text-sm text-text-dim">
          اولین نفر باشید — از ویرایشگر چیدمان خود را ثبت کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border-strong bg-surface-panel">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-border-strong text-[10px] tracking-wide text-text-faint uppercase">
            <th scope="col" className="w-10 px-4 py-3 text-right font-medium">
              رتبه
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              نام
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              امتیاز
            </th>
            <th scope="col" className="hidden px-4 py-3 text-right font-medium sm:table-cell">
              تاریخ
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="border-b border-border-strong/40 transition-colors hover:bg-[#0C1E38]"
            >
              <td className="px-4 py-3 text-sm">{rankDisplay(entry.rank)}</td>
              <td className="px-4 py-3 text-text-secondary">
                {entry.alias?.trim() ? entry.alias : "بدون نام"}
              </td>
              <td className="px-4 py-3 text-left font-mono font-semibold text-primary tabular-nums">
                {formatScore(entry.totalScore)}
              </td>
              <td className="hidden px-4 py-3 text-[10px] text-text-faint sm:table-cell">
                {formatLeaderboardDate(entry.submittedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
