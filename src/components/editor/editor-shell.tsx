"use client";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useCallback, useState } from "react";

import { isShiftModifierKey } from "@/lib/layout";

import { SubmitLayoutDialog } from "~/components/leaderboard/submit-layout-dialog";
import { AppHeader } from "~/components/shared/app-header";

import { ScorePanel } from "./analytics/score-panel";
import { useLiveScore } from "./analytics/use-live-score";
import { CharacterPalette } from "./character-palette";
import { EDITOR_MAX_WIDTH_CLASS } from "./constants";
import { DraftSaveIndicator } from "./draft-save-indicator";
import { editorCollisionDetection } from "./drag-utils";
import { EditorToolbar } from "./editor-toolbar";
import { KeyboardCanvas } from "./keyboard-canvas";
import { LayerToggle } from "./layer-toggle";
import { useEditorDnD } from "./use-editor-dnd";
import { useDraftPersistence } from "./use-draft-persistence";
import { useEditorShellState } from "./use-editor-shell-state";
import { useEditorShortcuts } from "./use-editor-shortcuts";

export function EditorShell() {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

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

  const draftPersistence = useDraftPersistence(
    layout,
    liveScore.presetId,
    liveScore.setPresetId,
  );

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
      id="pkbl-editor-dnd"
      sensors={sensors}
      collisionDetection={editorCollisionDetection}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-dvh bg-background text-foreground">
        <AppHeader
          center={
            <DraftSaveIndicator
              isHydrated={draftPersistence.isHydrated}
              isSaving={draftPersistence.isSaving}
              lastSavedAt={draftPersistence.lastSavedAt}
              saveError={draftPersistence.saveError}
            />
          }
        />

        <main className={`mx-auto ${EDITOR_MAX_WIDTH_CLASS} px-4 py-5`}>
          {!draftPersistence.isHydrated ? (
            <p className="py-12 text-center text-sm text-text-dim">
              در حال بارگذاری پیش‌نویس…
            </p>
          ) : (
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
              <aside className="order-1 lg:sticky lg:top-14 lg:order-2 lg:max-h-[calc(100dvh-4rem)] lg:w-[320px] lg:shrink-0 lg:overflow-y-auto lg:pb-6">
                <ScorePanel
                  layout={layout}
                  liveScore={liveScore}
                  onHotspotSelect={handleHotspotSelect}
                  onOpenSubmit={() => setIsSubmitOpen(true)}
                />
              </aside>

              <div className="order-2 min-w-0 flex-1 space-y-3 lg:order-1">
                {lastError ? (
                  <div
                    className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent"
                    role="alert"
                  >
                    <span>{lastError}</span>
                    <button
                      type="button"
                      onClick={clearError}
                      className="rounded px-2 py-1 text-xs hover:bg-accent/15"
                    >
                      بستن
                    </button>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2">
                  <LayerToggle activeLayer={activeLayer} onChange={setLayer} />
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

                {pendingChar ? (
                  <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] text-primary">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/40 bg-primary/20 text-[15px]">
                      {pendingChar}
                    </span>
                    روی کلید مورد نظر کلیک کنید تا «{pendingChar}» تخصیص داده
                    شود
                    <button
                      type="button"
                      onClick={() => setPendingChar(null)}
                      className="mr-auto text-primary/60 transition-colors hover:text-primary"
                      aria-label="لغو انتخاب کاراکتر"
                    >
                      ×
                    </button>
                  </div>
                ) : null}

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

                <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-keyboard px-3 py-2 text-[10px] text-text-faint">
                  <span aria-hidden="true">ℹ</span>
                  کلیک روی کلید = پنجره انتخاب · کلیک روی حرف در پالت + کلیک
                  روی کلید = تخصیص سریع · کشیدن حرف یا کلید = جابجایی
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDrag?.kind === "char" ? (
          <div className="flex h-14 w-14 cursor-grabbing items-center justify-center rounded-md border border-primary/50 bg-primary/20 text-sm text-primary shadow-xl">
            {activeDrag.char}
          </div>
        ) : null}
        {activeDrag?.kind === "key" ? (
          <div
            className="flex cursor-grabbing items-center justify-center rounded-md border border-primary/50 bg-primary/20 text-sm text-primary shadow-xl"
            style={{ width: activeDrag.width, height: activeDrag.height }}
          >
            <span className="truncate px-1">{activeDrag.label}</span>
          </div>
        ) : null}
      </DragOverlay>

      <SubmitLayoutDialog
        isOpen={isSubmitOpen}
        layout={layout}
        corpusPresetId={liveScore.presetId}
        totalScore={liveScore.result?.total ?? null}
        isScoreStale={liveScore.isStale}
        onClose={() => setIsSubmitOpen(false)}
      />
    </DndContext>
  );
}
