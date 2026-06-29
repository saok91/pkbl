"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { GlossaryEntry } from "./metric-glossary";

const HOVER_OPEN_MS = 300;

type MetricInfoProps = {
  entry: GlossaryEntry;
  className?: string;
};

export function MetricInfo({ entry, className = "" }: MetricInfoProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const descriptionId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setPinned(false);
  }, []);

  const scheduleHoverOpen = useCallback(() => {
    if (pinned) {
      return;
    }
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, HOVER_OPEN_MS);
  }, [pinned]);

  const cancelHoverOpen = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (!pinned) {
      setOpen(false);
    }
  }, [pinned]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current !== null) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open, close]);

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`توضیح ${entry.termFa}`}
        aria-expanded={open}
        aria-describedby={open ? descriptionId : undefined}
        onClick={() => {
          if (open && pinned) {
            close();
            return;
          }
          setPinned(true);
          setOpen(true);
        }}
        onMouseEnter={scheduleHoverOpen}
        onMouseLeave={cancelHoverOpen}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-600 text-[10px] text-slate-400 hover:border-sky-500 hover:text-sky-400 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
      >
        i
      </button>
      {open ? (
        <div
          ref={popoverRef}
          id={descriptionId}
          role="tooltip"
          onMouseEnter={scheduleHoverOpen}
          onMouseLeave={cancelHoverOpen}
          className="absolute top-full z-20 mt-1 w-56 rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-200 shadow-lg"
          style={{ insetInlineStart: 0 }}
        >
          <p className="font-medium text-sky-300">{entry.termFa}</p>
          <p className="mt-1 leading-relaxed text-slate-300">
            {entry.definitionFa}
          </p>
          {entry.exampleFa ? (
            <p className="mt-1 text-slate-500">{entry.exampleFa}</p>
          ) : null}
        </div>
      ) : null}
    </span>
  );
}
