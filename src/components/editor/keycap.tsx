"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { memo, useState } from "react";

import type { Layer } from "@/lib/layout/types";

import { DRAG_ID, KEYBOARD_PADDING_PX } from "./constants";
import { KeyCharPopover } from "./key-char-popover";
import type { KeyRect } from "./keyboard-layout";

type KeycapProps = {
  rect: KeyRect;
  primaryLabel: string;
  alternateLabel: string;
  activeLayer: Layer;
  isSelected: boolean;
  isPopoverOpen: boolean;
  isDropHighlight: boolean;
  onClick: () => void;
  onPopoverSelect?: (char: string) => void;
  onPopoverClose?: () => void;
};

export const Keycap = memo(function Keycap({
  rect,
  primaryLabel,
  alternateLabel,
  activeLayer,
  isSelected,
  isPopoverOpen,
  isDropHighlight,
  onClick,
  onPopoverSelect,
  onPopoverClose,
}: KeycapProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { keyId, key, x, y, width, height } = rect;
  const isEditable = key.isEditable;

  const showAlternate =
    isHovered || isPopoverOpen || activeLayer === "shift";
  const displayLabel =
    key.modifierLabel ?? (primaryLabel || (isEditable ? "·" : ""));

  const droppable = useDroppable({
    id: DRAG_ID.dropKey(keyId),
    disabled: !isEditable,
    data: { type: "key", keyId },
  });

  const draggable = useDraggable({
    id: DRAG_ID.key(keyId),
    disabled: !isEditable,
    data: {
      type: "key",
      keyId,
      label: displayLabel,
      width,
      height,
    },
  });

  const setRefs = (node: HTMLButtonElement | null) => {
    droppable.setNodeRef(node);
    draggable.setNodeRef(node);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: x + KEYBOARD_PADDING_PX,
        top: y + KEYBOARD_PADDING_PX,
        width,
        height,
      }}
    >
      <button
        ref={setRefs}
        type="button"
        style={{ width: "100%", height: "100%" }}
        disabled={!isEditable}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={isEditable ? onClick : undefined}
        {...draggable.listeners}
        {...draggable.attributes}
        className={`relative flex items-center justify-center rounded-md border text-sm transition-colors ${
          isDropHighlight
            ? "border-emerald-400 bg-emerald-900/80 text-white ring-2 ring-emerald-400/60"
            : isPopoverOpen
              ? "border-sky-300 bg-sky-600 text-white"
              : isSelected
                ? "border-sky-400 bg-sky-700 text-white"
                : isEditable
                  ? droppable.isOver
                    ? "border-cyan-400 bg-slate-700 text-slate-100"
                    : "border-slate-600 bg-slate-800 text-slate-100 hover:border-slate-500"
                  : "cursor-default border-slate-700 bg-slate-950 text-slate-400"
        } ${draggable.isDragging ? "pointer-events-none invisible" : ""}`}
        aria-label={key.modifierLabel ?? `کلید ${displayLabel}`}
        aria-expanded={isPopoverOpen}
      >
        <span className="truncate px-1">{displayLabel}</span>
        {showAlternate && alternateLabel && !key.modifierLabel ? (
          <span className="absolute top-0.5 right-1 text-[10px] text-slate-400">
            {alternateLabel}
          </span>
        ) : null}
      </button>
      {isPopoverOpen && onPopoverSelect && onPopoverClose ? (
        <KeyCharPopover
          onSelect={onPopoverSelect}
          onClose={onPopoverClose}
          className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2"
        />
      ) : null}
    </div>
  );
});
