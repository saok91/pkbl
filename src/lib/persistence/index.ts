export {
  clearEditorDraft,
  createEditorDraft,
  draftToLayout,
  EDITOR_DRAFT_STORAGE_KEY,
  EDITOR_DRAFT_VERSION,
  parseEditorDraft,
  readEditorDraft,
  readEditorDraftCorpusPresetId,
  writeEditorDraft,
} from "./draft";

export type { DraftWriteError, DraftWriteResult, EditorDraft } from "./draft";

/** Domain module marker for boundary tests. */
export const PERSISTENCE_MODULE = "persistence" as const;
