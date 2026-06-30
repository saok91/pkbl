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
      <p className="text-text-dim py-12 text-center text-sm">
        در حال بارگذاری جدول امتیازات…
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p
        className="border-accent/30 bg-accent/10 text-accent rounded-lg border px-4 py-3 text-sm"
        role="alert"
      >
        {errorMessage}
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="border-border-strong bg-surface-panel rounded-xl border px-6 py-12 text-center">
        <p className="text-text-secondary text-base font-medium">
          هنوز چیدمانی ثبت نشده
        </p>
        <p className="text-text-dim mt-2 text-sm">
          اولین نفر باشید — از ویرایشگر چیدمان خود را ثبت کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border-strong bg-surface-panel overflow-hidden rounded-xl border">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-border-strong text-text-faint border-b text-[10px] tracking-wide uppercase">
            <th scope="col" className="w-10 px-4 py-3 text-right font-medium">
              رتبه
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              نام
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              امتیاز
            </th>
            <th
              scope="col"
              className="hidden px-4 py-3 text-right font-medium sm:table-cell"
            >
              تاریخ
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="border-border-strong/40 border-b transition-colors hover:bg-[#0C1E38]"
            >
              <td className="px-4 py-3 text-sm">{rankDisplay(entry.rank)}</td>
              <td className="text-text-secondary px-4 py-3">
                {entry.alias?.trim() ? entry.alias : "بدون نام"}
              </td>
              <td className="text-primary px-4 py-3 text-left font-mono font-semibold tabular-nums">
                {formatScore(entry.totalScore)}
              </td>
              <td className="text-text-faint hidden px-4 py-3 text-[10px] sm:table-cell">
                {formatLeaderboardDate(entry.submittedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
