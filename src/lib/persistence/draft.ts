import {
  CORPUS_PRESET_STORAGE_KEY,
  DEFAULT_CORPUS_PRESET_ID,
  isCorpusPresetId,
  type CorpusPresetId,
} from "@/lib/corpus/client-presets";
import { editorDraftSchema } from "@/lib/layout/wire-schema";
import { layoutFromWire, layoutToWire, type LayoutWire } from "@/lib/layout/wire";
import type { Layout } from "@/lib/layout/types";

/** E8-S1 uses localStorage only; IndexedDB deferred to a later story if quota becomes an issue. */
export const EDITOR_DRAFT_STORAGE_KEY = "pkbl-editor-draft";
export const EDITOR_DRAFT_VERSION = 1 as const;

export type EditorDraft = {
  readonly version: typeof EDITOR_DRAFT_VERSION;
  readonly savedAt: string;
  readonly corpusPresetId: CorpusPresetId;
  readonly layout: LayoutWire;
};

export type DraftWriteError = "quota_exceeded" | "storage_unavailable";

export type DraftWriteResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly error: DraftWriteError };

export function parseEditorDraft(raw: unknown): EditorDraft | null {
  const parsed = editorDraftSchema.safeParse(raw);
  if (!parsed.success) {
    return null;
  }

  return {
    version: EDITOR_DRAFT_VERSION,
    savedAt: parsed.data.savedAt,
    corpusPresetId: parsed.data.corpusPresetId,
    layout: parsed.data.layout,
  };
}

export function createEditorDraft(
  layout: Layout,
  corpusPresetId: CorpusPresetId,
  savedAt: string = new Date().toISOString(),
): EditorDraft {
  return {
    version: EDITOR_DRAFT_VERSION,
    savedAt,
    corpusPresetId,
    layout: layoutToWire(layout),
  };
}

export function draftToLayout(draft: EditorDraft): Layout {
  return layoutFromWire(draft.layout);
}

export function readEditorDraft(storage: Storage = localStorage): EditorDraft | null {
  const raw = storage.getItem(EDITOR_DRAFT_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return parseEditorDraft(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeEditorDraft(
  draft: EditorDraft,
  storage: Storage = localStorage,
): DraftWriteResult {
  try {
    storage.setItem(EDITOR_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return { ok: true };
  } catch (cause) {
    if (
      cause instanceof DOMException &&
      (cause.name === "QuotaExceededError" || cause.code === 22)
    ) {
      return { ok: false, error: "quota_exceeded" };
    }
    return { ok: false, error: "storage_unavailable" };
  }
}

export function clearEditorDraft(storage: Storage = localStorage): void {
  storage.removeItem(EDITOR_DRAFT_STORAGE_KEY);
}

/** Draft blob is the source of truth; falls back to the standalone preset key. */
export function readEditorDraftCorpusPresetId(
  storage: Storage = localStorage,
): CorpusPresetId {
  const fromDraft = readEditorDraft(storage)?.corpusPresetId;
  if (fromDraft) {
    return fromDraft;
  }

  const stored = storage.getItem(CORPUS_PRESET_STORAGE_KEY);
  if (stored && isCorpusPresetId(stored)) {
    return stored;
  }

  return DEFAULT_CORPUS_PRESET_ID;
}
