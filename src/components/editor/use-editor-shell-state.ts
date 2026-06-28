"use client";

import { useShallow } from "zustand/react/shallow";

import { canRedo, canUndo } from "./editor-state";
import { useEditorStore } from "./use-editor-store";

export function useEditorShellState() {
  return useEditorStore(
    useShallow((state) => ({
      layout: state.layout,
      activeLayer: state.activeLayer,
      selectedKeyId: state.selectedKeyId,
      pendingChar: state.pendingChar,
      openPopoverKeyId: state.openPopoverKeyId,
      lastError: state.lastError,
      canUndo: canUndo(state),
      canRedo: canRedo(state),
      setLayer: state.setLayer,
      openPopover: state.openPopover,
      selectKey: state.selectKey,
      setPendingChar: state.setPendingChar,
      assignChar: state.assignChar,
      swapKeys: state.swapKeys,
      resetKey: state.resetKey,
      resetAll: state.resetAll,
      undo: state.undo,
      redo: state.redo,
      clearError: state.clearError,
    })),
  );
}
