"use client";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useCallback } from "react";

import { isShiftModifierKey } from "@/lib/layout";

import { PERSIAN_STANDARD_60_NAME } from "@/lib/layout/persian-standard-60";

import { ScorePanel } from "./analytics/score-panel";
import { useLiveScore } from "./analytics/use-live-score";
import { CharacterPalette } from "./character-palette";
import { EDITOR_MAX_WIDTH_CLASS } from "./constants";
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

  const liveScore = useLiveScore(layout);

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
      const key = layout.keys.get(keyId);
      if (isShiftModifierKey(key?.modifierLabel)) {
        setLayer(activeLayer === "shift" ? "base" : "shift");
        openPopover(null);
        selectKey(null);
        setPendingChar(null);
        return;
      }

      if (pendingChar) {
        assignChar(keyId, pendingChar);
        flashDropTarget(keyId);
        return;
      }
      selectKey(keyId);
      openPopover(openPopoverKeyId === keyId ? null : keyId);
    },
    [
      activeLayer,
      assignChar,
      flashDropTarget,
      layout.keys,
      openPopover,
      openPopoverKeyId,
      pendingChar,
      selectKey,
      setLayer,
      setPendingChar,
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

  const handleHotspotSelect = useCallback(
    (keyId: string) => {
      selectKey(keyId);
      flashDropTarget(keyId);
      openPopover(null);
    },
    [flashDropTarget, openPopover, selectKey],
  );

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
      <div className="min-h-dvh bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
          <div className={`mx-auto flex ${EDITOR_MAX_WIDTH_CLASS} flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
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

        <main className={`mx-auto ${EDITOR_MAX_WIDTH_CLASS} px-4 py-3`}>
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_280px]">
            <div className="order-2 min-w-0 lg:order-1">
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

              <div className="mb-3">
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

              <div className="flex flex-col gap-3">
                <KeyboardCanvas
                  layout={layout}
                  activeLayer={activeLayer}
                  selectedKeyId={selectedKeyId}
                  openPopoverKeyId={openPopoverKeyId}
                  dropHighlightKeyId={dropHighlightKeyId}
                  hotspotKeyIds={liveScore.hotspotKeyIds}
                  onKeyClick={handleKeyClick}
                  onPopoverSelect={handlePopoverSelect}
                  onPopoverClose={handlePopoverClose}
                />

                <CharacterPalette
                  layout={layout}
                  pendingChar={pendingChar}
                  selectedKeyId={selectedKeyId}
                  onCharClick={handleCharClick}
                />
              </div>
            </div>

            <div className="order-1 lg:sticky lg:top-4 lg:order-2 lg:max-h-[calc(100dvh-5.5rem)] lg:overflow-y-auto">
              <ScorePanel
                layout={layout}
                liveScore={liveScore}
                onHotspotSelect={handleHotspotSelect}
              />
            </div>
          </div>
        </main>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDrag?.kind === "char" ? (
          <div className="flex h-14 w-14 cursor-grabbing items-center justify-center rounded-md border border-sky-300 bg-sky-800 text-sm text-white shadow-xl">
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
