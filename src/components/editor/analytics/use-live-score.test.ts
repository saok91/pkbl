import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * @vitest-environment jsdom
 */

import {
  CORPUS_PRESET_STORAGE_KEY,
  type CorpusPresetId,
} from "@/lib/corpus/client-presets";
import { assignChar } from "@/lib/layout";
import { keyIdAt } from "@/lib/layout/test-utils";
import { clearArtifactCache } from "@/lib/corpus/fetch-artifact";
import { ngramStatsToArtifact } from "@/lib/corpus/serialize";
import {
  buildGoldenLayout,
  buildGoldenNgramStats,
} from "@/lib/scoring/fixtures/golden";

import { useLiveScore } from "./use-live-score";

function mockFetchArtifact(presetId: CorpusPresetId = "wiki-fa") {
  const stats = {
    ...buildGoldenNgramStats(),
    corpusId: presetId,
  };
  const artifact = ngramStatsToArtifact(stats, "1", "2026-06-28T00:00:00.000Z");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(artifact),
    }),
  );
}

describe("useLiveScore", () => {
  beforeEach(() => {
    clearArtifactCache();
    localStorage.clear();
    mockFetchArtifact();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("computes score after debounce when layout is ready", async () => {
    const layout = buildGoldenLayout();
    const { result } = renderHook(() => useLiveScore(layout));

    await waitFor(
      () => {
        expect(result.current.isLoadingPreset).toBe(false);
        expect(result.current.result).not.toBeNull();
        expect(result.current.isStale).toBe(false);
      },
      { timeout: 3000 },
    );

    expect(result.current.result?.total).toBeTypeOf("number");
    expect(result.current.hotspotKeyIds.size).toBeLessThanOrEqual(3);
  });

  it("marks score stale while debounce is pending", async () => {
    const layout = buildGoldenLayout();
    const { result, rerender } = renderHook(
      ({ currentLayout }) => useLiveScore(currentLayout),
      { initialProps: { currentLayout: layout } },
    );

    await waitFor(() => {
      expect(result.current.isStale).toBe(false);
    });

    const modified = assignChar(layout, keyIdAt("D"), "base", "ا");
    rerender({ currentLayout: modified });

    expect(result.current.isStale).toBe(true);
  });

  it("persists preset selection to localStorage and refetches", async () => {
    const layout = buildGoldenLayout();
    const { result } = renderHook(() => useLiveScore(layout));

    await waitFor(() => {
      expect(result.current.isStale).toBe(false);
    });

    mockFetchArtifact("varzesh3");

    act(() => {
      result.current.setPresetId("varzesh3");
    });

    expect(localStorage.getItem(CORPUS_PRESET_STORAGE_KEY)).toBe("varzesh3");
    expect(result.current.presetId).toBe("varzesh3");
    expect(result.current.isStale).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoadingPreset).toBe(false);
      expect(result.current.isStale).toBe(false);
    });
  });

  it("sets error when corpus fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network fail")),
    );

    const layout = buildGoldenLayout();
    const { result } = renderHook(() => useLiveScore(layout));

    await waitFor(() => {
      expect(result.current.isLoadingPreset).toBe(false);
      expect(result.current.error).toBe("network fail");
    });

    expect(result.current.result).toBeNull();
    expect(result.current.isStale).toBe(true);
  });

  it("returns up to three hotspot key ids for keyboard rings", async () => {
    const layout = buildGoldenLayout();
    const { result } = renderHook(() => useLiveScore(layout));

    await waitFor(() => {
      expect(result.current.result).not.toBeNull();
    });

    const hotspotCount = result.current.result?.hotspots.length ?? 0;
    const expectedRingCount = Math.min(3, hotspotCount);
    expect(result.current.hotspotKeyIds.size).toBe(expectedRingCount);

    for (const keyId of result.current.hotspotKeyIds) {
      expect(
        result.current.result?.hotspots
          .slice(0, 3)
          .some((hotspot) => hotspot.keyId === keyId),
      ).toBe(true);
    }
  });
});
