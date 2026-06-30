"use client";

import { useState } from "react";

import { ConfirmDialog } from "./confirm-dialog";

type EditorToolbarProps = {
  canUndo: boolean;
  canRedo: boolean;
  selectedKeyId: string | null;
  onUndo: () => void;
  onRedo: () => void;
  onResetKey: () => void;
  onResetAll: () => void;
};

function UndoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.36 2.64L3 13" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 13" />
    </svg>
  );
}

export function EditorToolbar({
  canUndo,
  canRedo,
  selectedKeyId,
  onUndo,
  onRedo,
  onResetKey,
  onResetAll,
}: EditorToolbarProps) {
  const [isResetAllOpen, setIsResetAllOpen] = useState(false);

  const iconButtonClass =
    "rounded-lg border border-border-strong p-2 text-text-dim transition-all hover:border-[#2A4068] hover:text-text-secondary disabled:cursor-not-allowed disabled:opacity-25";

  const textButtonClass =
    "rounded-lg border border-border-strong px-3 py-1.5 text-[11px] text-text-dim transition-all hover:border-[#2A4068] hover:text-text-secondary disabled:cursor-not-allowed disabled:opacity-25";

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="بازگشت (Ctrl+Z)"
          aria-label="بازگشت"
          aria-keyshortcuts="Control+Z Meta+Z"
          className={iconButtonClass}
        >
          <UndoIcon />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          title="ازنو (Ctrl+Y)"
          aria-label="ازنو"
          aria-keyshortcuts="Control+Y Meta+Shift+Z"
          className={iconButtonClass}
        >
          <RedoIcon />
        </button>
        <button
          type="button"
          onClick={onResetKey}
          disabled={!selectedKeyId}
          className={textButtonClass}
        >
          بازنشانی کلید
        </button>
        <button
          type="button"
          onClick={() => setIsResetAllOpen(true)}
          className="border-destructive/20 text-destructive/50 hover:border-destructive/35 hover:text-destructive rounded-lg border px-3 py-1.5 text-[11px] transition-all"
        >
          بازنشانی همه
        </button>
      </div>

      <ConfirmDialog
        isOpen={isResetAllOpen}
        title="بازنشانی همهٔ کلیدها"
        message="همهٔ کلیدهای قابل ویرایش به حالت پیش‌فرض برگردانده شوند؟"
        confirmLabel="بله، بازنشانی"
        cancelLabel="انصراف"
        onConfirm={() => {
          onResetAll();
          setIsResetAllOpen(false);
        }}
        onCancel={() => setIsResetAllOpen(false)}
      />
    </>
  );
}
