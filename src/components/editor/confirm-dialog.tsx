"use client";

import { useRef } from "react";

import { useFocusTrap } from "./use-focus-trap";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, isOpen, onCancel);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="border-border-strong bg-popover w-full max-w-sm rounded-xl border p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="text-text-secondary text-base font-semibold"
        >
          {title}
        </h2>
        <p id="confirm-dialog-message" className="text-text-dim mt-2 text-sm">
          {message}
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="border-destructive/25 bg-destructive/15 text-destructive hover:bg-destructive/25 flex-1 rounded-lg border py-2 text-sm transition-colors"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border-border-strong text-text-dim hover:text-text-secondary flex-1 rounded-lg border py-2 text-sm transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
