"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { memo, useState } from "react";

import type { Layer } from "@/lib/layout/types";
import { isShiftModifierKey } from "@/lib/layout";

import { DRAG_ID, KEYBOARD_PADDING_PX } from "./constants";
import { KeyCharPopover } from "./key-char-popover";
import type { KeyRect } from "./keyboard-layout";
import { useClientMounted } from "./use-client-mounted";

function getKeyAriaLabel(
  modifierLabel: string | undefined,
  displayLabel: string,
): string {
  if (modifierLabel) {
    return modifierLabel;
  }
  if (displayLabel && displayLabel !== "·") {
    return `کلید ${displayLabel}`;
  }
  return "کلید خالی";
}

type KeycapProps = {
  rect: KeyRect;
  primaryLabel: string;
  alternateLabel: string;
  activeLayer: Layer;
  isSelected: boolean;
  isPopoverOpen: boolean;
  isDropHighlight: boolean;
  isHotspot: boolean;
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
  isHotspot,
  onClick,
  onPopoverSelect,
  onPopoverClose,
}: KeycapProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isClientMounted = useClientMounted();
  const { keyId, key, x, y, width, height } = rect;
  const isEditable = key.isEditable;
  const isShiftLayerToggle = isShiftModifierKey(key.modifierLabel);
  const isShiftLayerActive = isShiftLayerToggle && activeLayer === "shift";
  const isClickable = isEditable || isShiftLayerToggle;

  const showAlternate = isHovered || isPopoverOpen || activeLayer === "shift";
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

  const showHotspotRing = isHotspot && !isDropHighlight;
  const isModifierKey = Boolean(key.modifierLabel) && !isEditable;

  const modifierIdleClassName =
    "cursor-default border-slate-600 bg-slate-950 text-slate-500 text-xs font-semibold uppercase tracking-wide shadow-inner";

  const shiftToggleIdleClassName =
    "cursor-pointer border-slate-500 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wide shadow-inner ring-1 ring-inset ring-slate-700 hover:border-sky-500/50 hover:text-sky-300 hover:ring-sky-500/30";

  const shiftToggleActiveClassName =
    "cursor-pointer border-sky-500 bg-sky-600 text-white text-xs font-bold uppercase tracking-wide shadow-sm ring-1 ring-sky-400/40";

  const stateClassName = isDropHighlight
    ? "border-emerald-400 bg-emerald-900/80 text-white ring-2 ring-emerald-400/60"
    : isShiftLayerToggle
      ? isShiftLayerActive
        ? shiftToggleActiveClassName
        : shiftToggleIdleClassName
      : isPopoverOpen
        ? "border-sky-300 bg-sky-600 text-white"
        : isSelected
          ? "border-sky-400 bg-sky-700 text-white"
          : isEditable
            ? droppable.isOver
              ? "border-cyan-400 bg-slate-700 text-slate-100"
              : "border-slate-600 bg-slate-800 text-slate-100 hover:border-slate-500"
            : isModifierKey
              ? modifierIdleClassName
              : "cursor-default border-slate-700 bg-slate-950 text-slate-400";

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
        disabled={!isClickable}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={isClickable ? onClick : undefined}
        {...(isClientMounted ? draggable.listeners : {})}
        {...(isClientMounted ? draggable.attributes : {})}
        className={`relative flex items-center justify-center rounded-md border text-sm transition-colors ${stateClassName}${
          showHotspotRing ? "ring-2 ring-amber-400/70" : ""
        } ${draggable.isDragging ? "pointer-events-none invisible" : ""}`}
        aria-label={
          isShiftLayerToggle
            ? "Shift — تغییر لایهٔ شیفت"
            : getKeyAriaLabel(key.modifierLabel, displayLabel)
        }
        aria-pressed={isShiftLayerToggle ? isShiftLayerActive : undefined}
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
