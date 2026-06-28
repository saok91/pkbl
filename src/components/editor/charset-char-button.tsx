"use client";

import type { ButtonHTMLAttributes } from "react";

import {
  getCharDescription,
  getCharDisplayLabel,
  hasCustomCharLabel,
} from "@/lib/layout/charset-labels";

type CharsetCharButtonProps = {
  char: string;
  onClick: () => void;
  size?: "sm" | "md";
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
} as const;

export function CharsetCharButton({
  char,
  onClick,
  size = "md",
  className = "",
  buttonRef,
  dragProps,
}: CharsetCharButtonProps) {
  const label = getCharDisplayLabel(char);
  const description = getCharDescription(char);
  const sizeClass = hasCustomCharLabel(char)
    ? SIZE_CLASSES[size].custom
    : SIZE_CLASSES[size].default;

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      title={description}
      aria-label={description ?? label}
      className={`flex shrink-0 items-center justify-center rounded-md border border-slate-600 bg-slate-900 text-slate-100 hover:border-sky-500 hover:bg-sky-950 ${sizeClass} ${className}`}
      {...dragProps}
    >
      {label}
    </button>
  );
}
