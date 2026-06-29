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
  hotspotRank?: number;
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
  hotspotRank,
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

  const isModifierKey = Boolean(key.modifierLabel) && !isEditable;

  const modifierIdleClassName =
    "cursor-default border-border-strong bg-[#0A1420] text-[#3A5070] text-[9px] font-semibold uppercase tracking-wide shadow-inner";

  const shiftToggleIdleClassName =
    "cursor-pointer border-border-strong bg-[#0A1420] text-text-dim text-[9px] font-bold uppercase tracking-wide shadow-inner hover:border-primary/50 hover:text-primary";

  const shiftToggleActiveClassName =
    "cursor-pointer border-primary bg-primary/20 text-primary text-[9px] font-bold uppercase tracking-wide shadow-sm ring-1 ring-primary/40";

  const stateClassName = isDropHighlight
    ? "border-primary bg-primary/20 text-primary ring-1 ring-primary/50 scale-[1.03]"
    : isShiftLayerToggle
      ? isShiftLayerActive
        ? shiftToggleActiveClassName
        : shiftToggleIdleClassName
      : isPopoverOpen
        ? "border-primary bg-[#082820] text-primary shadow-[0_0_10px_rgba(0,212,170,0.25)] ring-1 ring-primary/40"
        : isSelected
          ? "border-primary bg-[#082820] text-primary shadow-[0_0_10px_rgba(0,212,170,0.25)] ring-1 ring-primary/40"
          : isHotspot
            ? "border-accent/50 bg-[#1A1200] text-[#F5DEAD] hover:bg-[#221700]"
            : isEditable
              ? droppable.isOver
                ? "border-primary bg-primary/20 text-text-secondary ring-1 ring-primary/50"
                : "border-border-strong bg-[#0C1830] text-text-secondary hover:border-[#2A4068] hover:bg-[#112040]"
              : isModifierKey
                ? modifierIdleClassName
                : "cursor-default border-border-strong bg-[#0A1420] text-text-dim";

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
        className={`relative flex items-center justify-center overflow-hidden rounded-sm border text-center text-sm transition-all duration-100 select-none ${stateClassName} ${draggable.isDragging ? "pointer-events-none invisible" : ""}`}
        aria-label={
          isShiftLayerToggle
            ? "Shift — تغییر لایهٔ شیفت"
            : getKeyAriaLabel(key.modifierLabel, displayLabel)
        }
        aria-pressed={isShiftLayerToggle ? isShiftLayerActive : undefined}
        aria-expanded={isPopoverOpen}
      >
        {hotspotRank !== undefined ? (
          <span className="absolute top-0.5 right-0.5 z-10 flex h-3 w-3 items-center justify-center rounded-full bg-accent text-[7px] leading-none font-bold text-black">
            {hotspotRank + 1}
          </span>
        ) : null}
        <span
          className={`truncate px-1 leading-none ${key.modifierLabel ? "text-[9px] font-mono" : "text-[15px]"}`}
        >
          {displayLabel}
        </span>
        {showAlternate && alternateLabel && !key.modifierLabel ? (
          <span className="absolute top-0.5 right-1 text-[10px] text-text-faint">
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
