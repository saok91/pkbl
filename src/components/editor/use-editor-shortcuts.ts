"use client";

import { useEffect } from "react";

type UseEditorShortcutsOptions = {
  canUndo: boolean;
  canRedo: boolean;
  openPopoverKeyId: string | null;
  onUndo: () => void;
  onRedo: () => void;
  onClosePopover: () => void;
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function useEditorShortcuts({
  canUndo,
  canRedo,
  openPopoverKeyId,
  onUndo,
  onRedo,
  onClosePopover,
}: UseEditorShortcutsOptions): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      const mod = event.ctrlKey || event.metaKey;

      if (mod && event.key === "z" && !event.shiftKey) {
        if (canUndo) {
          event.preventDefault();
          onUndo();
        }
        return;
      }

      if (mod && (event.key === "y" || (event.key === "z" && event.shiftKey))) {
        if (canRedo) {
          event.preventDefault();
          onRedo();
        }
        return;
      }

      if (event.key === "Escape" && openPopoverKeyId) {
        event.preventDefault();
        onClosePopover();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    canRedo,
    canUndo,
    onClosePopover,
    onRedo,
    onUndo,
    openPopoverKeyId,
  ]);
}
