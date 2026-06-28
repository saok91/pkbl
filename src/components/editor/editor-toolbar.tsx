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

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          aria-keyshortcuts="Control+Z Meta+Z"
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          بازگشت
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          aria-keyshortcuts="Control+Y Meta+Shift+Z"
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ازنو
        </button>
        <button
          type="button"
          onClick={onResetKey}
          disabled={!selectedKeyId}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          بازنشانی کلید
        </button>
        <button
          type="button"
          onClick={() => setIsResetAllOpen(true)}
          className="rounded-lg border border-rose-700/60 bg-rose-950/40 px-3 py-2 text-sm text-rose-200 hover:bg-rose-900/50"
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
