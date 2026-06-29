/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { LeaderboardEntry } from "@/lib/leaderboard/types";

import { LeaderboardTable } from "./leaderboard-table";

const sampleEntries: LeaderboardEntry[] = [
  {
    id: "score-1",
    rank: 1,
    alias: "alpha",
    totalScore: 950,
    corpusPresetId: "wiki-fa",
    submittedAt: new Date("2026-06-30T12:00:00.000Z"),
  },
];

describe("LeaderboardTable", () => {
  it("shows loading state when empty and loading", () => {
    render(
      <LeaderboardTable entries={[]} isLoading errorMessage={null} />,
    );

    expect(screen.getByText("در حال بارگذاری جدول امتیازات…")).toBeInTheDocument();
  });

  it("shows empty state when no entries", () => {
    render(
      <LeaderboardTable entries={[]} isLoading={false} errorMessage={null} />,
    );

    expect(screen.getByText("هنوز چیدمانی ثبت نشده")).toBeInTheDocument();
  });

  it("renders rank, alias, score, and date columns", () => {
    render(
      <LeaderboardTable
        entries={sampleEntries}
        isLoading={false}
        errorMessage={null}
      />,
    );

    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.getByText("۹۵۰")).toBeInTheDocument();
    expect(screen.getByText("رتبه")).toBeInTheDocument();
  });

  it("shows error message with alert role", () => {
    render(
      <LeaderboardTable
        entries={[]}
        isLoading={false}
        errorMessage="خطای شبکه"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("خطای شبکه");
  });

  it("uses fallback label for missing alias", () => {
    render(
      <LeaderboardTable
        entries={[{ ...sampleEntries[0]!, alias: null }]}
        isLoading={false}
        errorMessage={null}
      />,
    );

    expect(screen.getByText("بدون نام")).toBeInTheDocument();
  });
});
