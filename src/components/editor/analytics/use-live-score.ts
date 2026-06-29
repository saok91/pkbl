"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_CORPUS_PRESET_ID,
  type CorpusPresetId,
  writeStoredCorpusPresetId,
} from "@/lib/corpus/client-presets";
import { readEditorDraftCorpusPresetId } from "@/lib/persistence";
import { fetchPresetNgramStats } from "@/lib/corpus/fetch-artifact";
import type { NgramStats } from "@/lib/corpus/types";
import type { Layout } from "@/lib/layout/types";
import { computeScore } from "@/lib/scoring";
import type { ScoreResult } from "@/lib/scoring/types";

const SCORE_DEBOUNCE_MS = 120;
const HOTSPOT_RING_COUNT = 3;
const SCORE_DELTA_VISIBLE_MS = 2000;

export type LiveScoreState = {
  readonly result: ScoreResult | null;
  readonly ngramStats: NgramStats | null;
  readonly isStale: boolean;
  readonly isLoadingPreset: boolean;
  readonly error: string | null;
  readonly presetId: CorpusPresetId;
  readonly hotspotKeyIds: ReadonlySet<string>;
  readonly scoreDelta: number | null;
  readonly showScoreDelta: boolean;
  readonly setPresetId: (presetId: CorpusPresetId) => void;
};

export function useLiveScore(layout: Layout): LiveScoreState {
  const [presetId, setPresetIdState] = useState<CorpusPresetId>(() =>
    typeof window === "undefined"
      ? DEFAULT_CORPUS_PRESET_ID
      : readEditorDraftCorpusPresetId(),
  );
  const [ngramStats, setNgramStats] = useState<NgramStats | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [isStale, setIsStale] = useState(true);
  const [isLoadingPreset, setIsLoadingPreset] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scoreDelta, setScoreDelta] = useState<number | null>(null);
  const [showScoreDelta, setShowScoreDelta] = useState(false);
  const previousTotalRef = useRef<number | null>(null);
  const hasStableScoreRef = useRef(false);

  const setPresetId = useCallback((nextPresetId: CorpusPresetId) => {
    setPresetIdState(nextPresetId);
    writeStoredCorpusPresetId(nextPresetId);
    setIsStale(true);
    previousTotalRef.current = null;
    hasStableScoreRef.current = false;
    setShowScoreDelta(false);
    setScoreDelta(null);
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
      const previousTotal = previousTotalRef.current;

      if (
        hasStableScoreRef.current &&
        previousTotal !== null &&
        previousTotal !== nextResult.total
      ) {
        setScoreDelta(nextResult.total - previousTotal);
        setShowScoreDelta(true);
      } else {
        setShowScoreDelta(false);
        setScoreDelta(null);
      }

      previousTotalRef.current = nextResult.total;
      hasStableScoreRef.current = true;
      setResult(nextResult);
      setIsStale(false);
    }, SCORE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [layout, ngramStats]);

  useEffect(() => {
    if (!showScoreDelta) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowScoreDelta(false);
    }, SCORE_DELTA_VISIBLE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showScoreDelta, scoreDelta]);

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
    ngramStats,
    isStale: isStale || isLoadingPreset,
    isLoadingPreset,
    error,
    presetId,
    hotspotKeyIds,
    scoreDelta,
    showScoreDelta,
    setPresetId,
  };
}
