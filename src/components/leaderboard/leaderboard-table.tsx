"use client";

import { formatScore } from "@/components/editor/analytics/format-analytics";
import type { LeaderboardEntry } from "@/lib/leaderboard/types";

import { formatLeaderboardDate } from "./format-leaderboard-date";

type LeaderboardTableProps = {
  readonly entries: readonly LeaderboardEntry[];
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
};

export function LeaderboardTable({
  entries,
  isLoading,
  errorMessage,
}: LeaderboardTableProps) {
  if (isLoading && entries.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">
        در حال بارگذاری جدول امتیازات…
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="rounded-lg border border-amber-600/50 bg-amber-950/40 px-4 py-3 text-sm text-amber-100" role="alert">
        {errorMessage}
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
        <p className="text-base font-medium text-slate-200">
          هنوز چیدمانی ثبت نشده
        </p>
        <p className="mt-2 text-sm text-slate-400">
          اولین نفر باشید — از ویرایشگر چیدمان خود را ثبت کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900/80 text-slate-400">
          <tr>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              رتبه
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              نام
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              امتیاز
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              تاریخ ثبت
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="border-t border-slate-800/80 bg-slate-900/40 even:bg-slate-900/20"
            >
              <td className="px-4 py-3 font-medium text-slate-100 tabular-nums">
                {formatScore(entry.rank)}
              </td>
              <td className="px-4 py-3 text-slate-200">
                {entry.alias?.trim() ? entry.alias : "بدون نام"}
              </td>
              <td className="px-4 py-3 font-semibold text-sky-200 tabular-nums">
                {formatScore(entry.totalScore)}
              </td>
              <td className="px-4 py-3 text-slate-400">
                {formatLeaderboardDate(entry.submittedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
