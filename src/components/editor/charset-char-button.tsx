"use client";

import type { ButtonHTMLAttributes } from "react";

import {
  getCharDescription,
  getCharDisplayLabel,
  hasCustomCharLabel,
} from "@/lib/layout/charset-labels";

import {
  paletteCustomLabelFontSize,
  paletteUnitFontSize,
} from "./palette-grid";

type CharsetCharButtonProps = {
  char: string;
  onClick: () => void;
  size?: "sm" | "md" | "key";
  /** When set, overrides preset size classes (palette auto-fit). */
  unitPx?: number;
  className?: string;
  buttonRef?: (node: HTMLButtonElement | null) => void;
  dragProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

const SIZE_CLASSES = {
  sm: {
    default: "h-7 w-7 text-xs",
    custom: "h-7 min-w-[4.5rem] px-1.5 text-[10px]",
  },
  md: {
    default: "h-8 w-8 text-sm",
    custom: "h-8 min-w-[5rem] px-2 text-[11px]",
  },
  key: {
    default: "h-14 w-14 text-sm",
    custom: "h-14 w-14 px-0.5 text-[9px] leading-tight",
  },
} as const;

export function CharsetCharButton({
  char,
  onClick,
  size = "md",
  unitPx,
  className = "",
  buttonRef,
  dragProps,
}: CharsetCharButtonProps) {
  const label = getCharDisplayLabel(char);
  const description = getCharDescription(char);
  const isCustom = hasCustomCharLabel(char);

  const sizeClass =
    unitPx === undefined
      ? isCustom
        ? SIZE_CLASSES[size].custom
        : SIZE_CLASSES[size].default
      : "shrink-0 border p-0 leading-tight";

  const paletteBaseClass =
    unitPx === undefined
      ? "border border-slate-600 bg-slate-900 text-slate-100 hover:border-sky-500 hover:bg-sky-950"
      : "";

  const unitStyle =
    unitPx === undefined
      ? undefined
      : {
          width: unitPx,
          height: unitPx,
          minWidth: unitPx,
          fontSize: isCustom
            ? paletteCustomLabelFontSize(unitPx)
            : paletteUnitFontSize(unitPx),
        };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      title={description}
      aria-label={description ?? label}
      style={unitStyle}
      className={`flex items-center justify-center rounded-md ${paletteBaseClass} ${sizeClass} ${className}`}
      {...dragProps}
    >
      {label}
    </button>
  );
}
