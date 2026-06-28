"use client";

import { create } from "zustand";

import type { Layer } from "@/lib/layout/types";

import {
  canRedo,
  canUndo,
  createInitialEditorState,
  editorReducer,
  type EditorAction,
  type EditorState,
} from "./editor-state";

type EditorStore = EditorState & {
  dispatch: (action: EditorAction) => void;
  setLayer: (layer: Layer) => void;
  selectKey: (keyId: string | null) => void;
  openPopover: (keyId: string | null) => void;
  setPendingChar: (char: string | null) => void;
  assignChar: (keyId: string, char: string) => void;
  swapKeys: (keyA: string, keyB: string) => void;
  resetKey: (keyId: string) => void;
  resetAll: () => void;
  undo: () => void;
  redo: () => void;
  clearError: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

function clearTransientUi(): Partial<EditorState> {
  return {
    openPopoverKeyId: null,
    pendingChar: null,
  };
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...createInitialEditorState(),

  dispatch: (action) => {
    set((state) => editorReducer(state, action));
  },

  setLayer: (layer) => {
    get().dispatch({ type: "SET_LAYER", layer });
  },

  selectKey: (keyId) => {
    get().dispatch({ type: "SELECT_KEY", keyId });
  },

  openPopover: (keyId) => {
    get().dispatch({ type: "OPEN_POPOVER", keyId });
  },

  setPendingChar: (char) => {
    get().dispatch({ type: "SET_PENDING_CHAR", char });
  },

  assignChar: (keyId, char) => {
    set((state) => {
      const next = editorReducer(state, {
        type: "ASSIGN_CHAR",
        keyId,
        char,
      });
      if (next.lastError) {
        return next;
      }
      return {
        ...next,
        ...clearTransientUi(),
        selectedKeyId: keyId,
      };
    });
  },

  swapKeys: (keyA, keyB) => {
    set((state) => {
      const next = editorReducer(state, {
        type: "SWAP_KEYS",
        keyA,
        keyB,
      });
      if (next.lastError) {
        return next;
      }
      return {
        ...next,
        ...clearTransientUi(),
      };
    });
  },

  resetKey: (keyId) => {
    set((state) => ({
      ...editorReducer(state, { type: "RESET_KEY", keyId }),
      ...clearTransientUi(),
    }));
  },

  resetAll: () => {
    set((state) => ({
      ...editorReducer(state, { type: "RESET_ALL" }),
      ...clearTransientUi(),
      selectedKeyId: null,
    }));
  },

  undo: () => {
    get().dispatch({ type: "UNDO" });
  },

  redo: () => {
    get().dispatch({ type: "REDO" });
  },

  clearError: () => {
    get().dispatch({ type: "CLEAR_ERROR" });
  },

  canUndo: () => canUndo(get()),
  canRedo: () => canRedo(get()),
}));

/** Reset store between tests. */
export function resetEditorStore(layout?: EditorState["layout"]): void {
  useEditorStore.setState(createInitialEditorState(layout));
}
