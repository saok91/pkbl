/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getDefaultTemplate } from "@/lib/layout";
import { buildGoldenNgramStats } from "@/lib/scoring/fixtures/golden";
import type { ScoreResult } from "@/lib/scoring/types";

import { ScorePanel } from "./score-panel";
import type { LiveScoreState } from "./use-live-score";

vi.mock("./comprehension/view-mode-toggle", () => ({
  useAnalyticsViewMode: () => ({ mode: "simple", setMode: vi.fn() }),
  ViewModeToggle: () => <div data-testid="view-mode-toggle" />,
}));

function buildLiveScore(result: ScoreResult): LiveScoreState {
  const stats = buildGoldenNgramStats();
  return {
    result,
    ngramStats: stats,
    isStale: false,
    isLoadingPreset: false,
    error: null,
    presetId: "wiki-fa",
    hotspotKeyIds: new Set(result.hotspots.slice(0, 3).map((h) => h.keyId)),
    scoreDelta: null,
    showScoreDelta: false,
    setPresetId: vi.fn(),
  };
}

describe("ScorePanel integration", () => {
  it("renders comprehension layer in simple mode", async () => {
    const layout = getDefaultTemplate();
    const { computeScore } = await import("@/lib/scoring");
    const result = computeScore(layout, buildGoldenNgramStats());

    render(
      <ScorePanel
        layout={layout}
        liveScore={buildLiveScore(result)}
        onHotspotSelect={vi.fn()}
      />,
    );

    expect(screen.getByText(/چیدمان/)).toBeInTheDocument();
    expect(screen.getByText(/بهتر از چیدمان پیش‌فرض|برابر با چیدمان پیش‌فرض|بدتر از چیدمان پیش‌فرض/)).toBeInTheDocument();
    expect(screen.getByText("بار انگشتان")).toBeInTheDocument();
  });
});
