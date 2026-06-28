"use client";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useCallback } from "react";

import { PERSIAN_STANDARD_60_NAME } from "@/lib/layout/persian-standard-60";

import { CharacterPalette } from "./character-palette";
import { editorCollisionDetection } from "./drag-utils";
import { EditorToolbar } from "./editor-toolbar";
import { KeyboardCanvas } from "./keyboard-canvas";
import { LayerToggle } from "./layer-toggle";
import { useEditorDnD } from "./use-editor-dnd";
import { useEditorShellState } from "./use-editor-shell-state";
import { useEditorShortcuts } from "./use-editor-shortcuts";

export function EditorShell() {
  const {
    layout,
    activeLayer,
    selectedKeyId,
    pendingChar,
    openPopoverKeyId,
    lastError,
    canUndo,
    canRedo,
    setLayer,
    openPopover,
    selectKey,
    setPendingChar,
    assignChar,
    swapKeys,
    resetKey,
    resetAll,
    undo,
    redo,
    clearError,
  } = useEditorShellState();

  const {
    sensors,
    activeDrag,
    dropHighlightKeyId,
    flashDropTarget,
    measuring,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useEditorDnD({
    layout,
    activeLayer,
    assignChar,
    swapKeys,
    selectKey,
  });

  useEditorShortcuts({
    canUndo,
    canRedo,
    openPopoverKeyId,
    onUndo: undo,
    onRedo: redo,
    onClosePopover: () => openPopover(null),
  });

  const handleKeyClick = useCallback(
    (keyId: string) => {
      if (pendingChar) {
        assignChar(keyId, pendingChar);
        flashDropTarget(keyId);
        return;
      }
      selectKey(keyId);
      openPopover(openPopoverKeyId === keyId ? null : keyId);
    },
    [
      assignChar,
      flashDropTarget,
      openPopover,
      openPopoverKeyId,
      pendingChar,
      selectKey,
    ],
  );

  const handleCharClick = useCallback(
    (char: string) => {
      if (selectedKeyId) {
        assignChar(selectedKeyId, char);
        flashDropTarget(selectedKeyId);
        return;
      }
      setPendingChar(pendingChar === char ? null : char);
    },
    [assignChar, flashDropTarget, pendingChar, selectedKeyId, setPendingChar],
  );

  const handlePopoverSelect = useCallback(
    (keyId: string, char: string) => {
      assignChar(keyId, char);
      flashDropTarget(keyId);
    },
    [assignChar, flashDropTarget],
  );

  const handlePopoverClose = useCallback(() => {
    openPopover(null);
  }, [openPopover]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={editorCollisionDetection}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-4">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs tracking-widest text-slate-400 uppercase">
                Persian Keyboard Layout Lab
              </p>
              <h1 className="text-xl font-bold">ویرایشگر چیدمان</h1>
              <p className="text-sm text-slate-400">
                {PERSIAN_STANDARD_60_NAME} · ISIRI 9147
              </p>
            </div>
            <LayerToggle activeLayer={activeLayer} onChange={setLayer} />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6">
          {lastError ? (
            <div
              className="mb-4 flex items-center justify-between rounded-lg border border-amber-600/50 bg-amber-950/40 px-4 py-3 text-sm text-amber-100"
              role="alert"
            >
              <span>{lastError}</span>
              <button
                type="button"
                onClick={clearError}
                className="rounded px-2 py-1 text-xs hover:bg-amber-900/50"
              >
                بستن
              </button>
            </div>
          ) : null}

          <div className="mb-4">
            <EditorToolbar
              canUndo={canUndo}
              canRedo={canRedo}
              selectedKeyId={selectedKeyId}
              onUndo={undo}
              onRedo={redo}
              onResetKey={() => {
                if (selectedKeyId) {
                  resetKey(selectedKeyId);
                }
              }}
              onResetAll={resetAll}
            />
          </div>

          <div className="flex flex-col gap-6">
            <KeyboardCanvas
              layout={layout}
              activeLayer={activeLayer}
              selectedKeyId={selectedKeyId}
              openPopoverKeyId={openPopoverKeyId}
              dropHighlightKeyId={dropHighlightKeyId}
              onKeyClick={handleKeyClick}
              onPopoverSelect={handlePopoverSelect}
              onPopoverClose={handlePopoverClose}
            />

            <CharacterPalette
              layout={layout}
              activeLayer={activeLayer}
              pendingChar={pendingChar}
              selectedKeyId={selectedKeyId}
              onCharClick={handleCharClick}
            />
          </div>
        </main>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDrag?.kind === "char" ? (
          <div className="flex h-10 w-10 cursor-grabbing items-center justify-center rounded-lg border border-sky-300 bg-sky-800 text-lg text-white shadow-xl">
            {activeDrag.char}
          </div>
        ) : null}
        {activeDrag?.kind === "key" ? (
          <div
            className="flex cursor-grabbing items-center justify-center rounded-md border border-sky-300 bg-sky-800 text-sm text-white shadow-xl"
            style={{ width: activeDrag.width, height: activeDrag.height }}
          >
            <span className="truncate px-1">{activeDrag.label}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
