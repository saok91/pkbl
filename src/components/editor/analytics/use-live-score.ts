"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  type CorpusPresetId,
  readStoredCorpusPresetId,
  writeStoredCorpusPresetId,
} from "@/lib/corpus/client-presets";
import { fetchPresetNgramStats } from "@/lib/corpus/fetch-artifact";
import type { NgramStats } from "@/lib/corpus/types";
import type { Layout } from "@/lib/layout/types";
import { computeScore } from "@/lib/scoring";
import type { ScoreResult } from "@/lib/scoring/types";

const SCORE_DEBOUNCE_MS = 120;
const HOTSPOT_RING_COUNT = 3;

export type LiveScoreState = {
  readonly result: ScoreResult | null;
  readonly isStale: boolean;
  readonly isLoadingPreset: boolean;
  readonly error: string | null;
  readonly presetId: CorpusPresetId;
  readonly hotspotKeyIds: ReadonlySet<string>;
  readonly setPresetId: (presetId: CorpusPresetId) => void;
};

export function useLiveScore(layout: Layout): LiveScoreState {
  const [presetId, setPresetIdState] = useState<CorpusPresetId>(
    readStoredCorpusPresetId,
  );
  const [ngramStats, setNgramStats] = useState<NgramStats | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [isStale, setIsStale] = useState(true);
  const [isLoadingPreset, setIsLoadingPreset] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setPresetId = useCallback((nextPresetId: CorpusPresetId) => {
    setPresetIdState(nextPresetId);
    writeStoredCorpusPresetId(nextPresetId);
    setIsStale(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setIsLoadingPreset(true);
    setError(null);

    fetchPresetNgramStats(presetId)
      .then((stats) => {
        if (cancelled) {
          return;
        }
        setNgramStats(stats);
      })
      .catch((cause: unknown) => {
        if (cancelled) {
          return;
        }
        const message =
          cause instanceof Error
            ? cause.message
            : "خطای ناشناخته در بارگذاری corpus";
        setError(message);
        setNgramStats(null);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingPreset(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [presetId]);

  useEffect(() => {
    if (!ngramStats) {
      return;
    }

    setIsStale(true);
    const timer = window.setTimeout(() => {
      const nextResult = computeScore(layout, ngramStats);
      setResult(nextResult);
      setIsStale(false);
    }, SCORE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [layout, ngramStats]);

  const hotspotKeyIds = useMemo(() => {
    if (!result) {
      return new Set<string>();
    }
    return new Set(
      result.hotspots
        .slice(0, HOTSPOT_RING_COUNT)
        .map((hotspot) => hotspot.keyId),
    );
  }, [result]);

  return {
    result,
    isStale: isStale || isLoadingPreset,
    isLoadingPreset,
    error,
    presetId,
    hotspotKeyIds,
    setPresetId,
  };
}
