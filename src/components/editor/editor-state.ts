import {
  assignChar,
  getDefaultTemplate,
  resetAllEditable,
  resetKey,
  swapKeys,
} from "@/lib/layout";
import type { Layer, Layout } from "@/lib/layout/types";
import { LayoutError } from "@/lib/layout/types";

import { MAX_UNDO_STEPS } from "./constants";

export type EditorState = {
  layout: Layout;
  activeLayer: Layer;
  selectedKeyId: string | null;
  pendingChar: string | null;
  openPopoverKeyId: string | null;
  history: Layout[];
  historyIndex: number;
  lastError: string | null;
};

export type EditorAction =
  | { type: "SET_LAYER"; layer: Layer }
  | { type: "SELECT_KEY"; keyId: string | null }
  | { type: "OPEN_POPOVER"; keyId: string | null }
  | { type: "SET_PENDING_CHAR"; char: string | null }
  | { type: "ASSIGN_CHAR"; keyId: string; char: string }
  | { type: "SWAP_KEYS"; keyA: string; keyB: string }
  | { type: "RESET_KEY"; keyId: string }
  | { type: "RESET_ALL" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "CLEAR_ERROR" };

export function createInitialEditorState(layout?: Layout): EditorState {
  const initialLayout = layout ?? getDefaultTemplate();
  return {
    layout: initialLayout,
    activeLayer: "base",
    selectedKeyId: null,
    pendingChar: null,
    openPopoverKeyId: null,
    history: [initialLayout],
    historyIndex: 0,
    lastError: null,
  };
}

function pushHistory(state: EditorState, nextLayout: Layout): EditorState {
  const truncated = state.history.slice(0, state.historyIndex + 1);
  const nextHistory = [...truncated, nextLayout];

  if (nextHistory.length > MAX_UNDO_STEPS + 1) {
    nextHistory.shift();
  }

  return {
    ...state,
    layout: nextLayout,
    history: nextHistory,
    historyIndex: nextHistory.length - 1,
    lastError: null,
  };
}

function withLayoutMutation(
  state: EditorState,
  mutate: (layout: Layout) => Layout,
): EditorState {
  try {
    const nextLayout = mutate(state.layout);
    return pushHistory(state, nextLayout);
  } catch (error) {
    const message =
      error instanceof LayoutError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unknown layout error";
    return {
      ...state,
      lastError: message,
    };
  }
}

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "SET_LAYER":
      return {
        ...state,
        activeLayer: action.layer,
        lastError: null,
      };

    case "SELECT_KEY":
      return {
        ...state,
        selectedKeyId: action.keyId,
        lastError: null,
      };

    case "OPEN_POPOVER":
      return {
        ...state,
        openPopoverKeyId: action.keyId,
        selectedKeyId: action.keyId,
        lastError: null,
      };

    case "SET_PENDING_CHAR":
      return {
        ...state,
        pendingChar: action.char,
        lastError: null,
      };

    case "ASSIGN_CHAR":
      return withLayoutMutation(state, (layout) =>
        assignChar(layout, action.keyId, state.activeLayer, action.char),
      );

    case "SWAP_KEYS":
      return withLayoutMutation(state, (layout) =>
        swapKeys(layout, action.keyA, action.keyB, state.activeLayer),
      );

    case "RESET_KEY":
      return withLayoutMutation(state, (layout) =>
        resetKey(layout, action.keyId, state.activeLayer),
      );

    case "RESET_ALL":
      return withLayoutMutation(state, (layout) => resetAllEditable(layout));

    case "UNDO": {
      if (state.historyIndex <= 0) {
        return state;
      }
      const nextIndex = state.historyIndex - 1;
      const nextLayout = state.history[nextIndex];
      if (!nextLayout) {
        return state;
      }
      return {
        ...state,
        layout: nextLayout,
        historyIndex: nextIndex,
        lastError: null,
      };
    }

    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) {
        return state;
      }
      const nextIndex = state.historyIndex + 1;
      const nextLayout = state.history[nextIndex];
      if (!nextLayout) {
        return state;
      }
      return {
        ...state,
        layout: nextLayout,
        historyIndex: nextIndex,
        lastError: null,
      };
    }

    case "CLEAR_ERROR":
      return {
        ...state,
        lastError: null,
      };

    default:
      return state;
  }
}

export function canUndo(state: EditorState): boolean {
  return state.historyIndex > 0;
}

export function canRedo(state: EditorState): boolean {
  return state.historyIndex < state.history.length - 1;
}

export function getKeyLabel(
  layout: Layout,
  keyId: string,
  layer: Layer,
): string {
  const key = layout.keys.get(keyId);
  if (!key) {
    return "";
  }
  if (key.modifierLabel) {
    return key.modifierLabel;
  }
  const slot = layout.assignments.get(keyId);
  const char = layer === "base" ? slot?.base : slot?.shift;
  return char ?? "";
}

export function getAlternateLabel(
  layout: Layout,
  keyId: string,
  layer: Layer,
): string {
  const slot = layout.assignments.get(keyId);
  if (!slot) {
    return "";
  }
  return layer === "base" ? slot.shift : slot.base;
}
