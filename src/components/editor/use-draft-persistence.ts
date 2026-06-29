"use client";

import { useEffect, useRef, useState } from "react";

import {
  type CorpusPresetId,
  writeStoredCorpusPresetId,
} from "@/lib/corpus/client-presets";
import type { Layout } from "@/lib/layout/types";
import {
  createEditorDraft,
  draftToLayout,
  readEditorDraft,
  type DraftWriteError,
  writeEditorDraft,
} from "@/lib/persistence";

import { resetEditorStore } from "./use-editor-store";

const DRAFT_SAVE_DEBOUNCE_MS = 400;

const SAVE_ERROR_MESSAGES: Record<DraftWriteError, string> = {
  quota_exceeded: "فضای ذخیره‌سازی مرورگر پر است — پیش‌نویس ذخیره نشد.",
  storage_unavailable: "ذخیرهٔ پیش‌نویس ممکن نیست — storage مرورگر در دسترس نیست.",
};

export type DraftPersistenceState = {
  readonly isHydrated: boolean;
  readonly lastSavedAt: string | null;
  readonly isSaving: boolean;
  readonly saveError: string | null;
};

export function useDraftPersistence(
  layout: Layout,
  corpusPresetId: CorpusPresetId,
  onRestoreCorpusPreset?: (presetId: CorpusPresetId) => void,
): DraftPersistenceState {
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const hasRestoredRef = useRef(false);
  const onRestoreRef = useRef(onRestoreCorpusPreset);

  onRestoreRef.current = onRestoreCorpusPreset;

  useEffect(() => {
    if (hasRestoredRef.current) {
      return;
    }
    hasRestoredRef.current = true;

    const draft = readEditorDraft();
    if (draft) {
      resetEditorStore(draftToLayout(draft));
      writeStoredCorpusPresetId(draft.corpusPresetId);
      onRestoreRef.current?.(draft.corpusPresetId);
      setLastSavedAt(draft.savedAt);
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    setIsSaving(true);
    const timer = window.setTimeout(() => {
      try {
        const savedAt = new Date().toISOString();
        const result = writeEditorDraft(
          createEditorDraft(layout, corpusPresetId, savedAt),
        );
        if (result.ok) {
          writeStoredCorpusPresetId(corpusPresetId);
          setLastSavedAt(savedAt);
          setSaveError(null);
        } else {
          setSaveError(SAVE_ERROR_MESSAGES[result.error]);
        }
      } catch {
        setSaveError(SAVE_ERROR_MESSAGES.storage_unavailable);
      } finally {
        setIsSaving(false);
      }
    }, DRAFT_SAVE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [corpusPresetId, isHydrated, layout]);

  return {
    isHydrated,
    lastSavedAt,
    isSaving,
    saveError,
  };
}
