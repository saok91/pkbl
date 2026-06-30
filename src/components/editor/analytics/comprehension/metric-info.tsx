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
        className="text-text-dim focus-visible:ring-primary inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1A2E50] text-[9px] hover:bg-[#1E3A60] focus-visible:ring-2 focus-visible:outline-none"
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
          className="border-border-strong bg-popover text-text-dim absolute top-full z-20 mt-1.5 w-52 rounded-lg border p-2.5 text-[11px] leading-relaxed shadow-2xl"
          style={{ insetInlineStart: 0 }}
        >
          <p className="text-primary font-medium">{entry.termFa}</p>
          <p className="mt-1">{entry.definitionFa}</p>
          {entry.exampleFa ? (
            <p className="text-text-faint mt-1">{entry.exampleFa}</p>
          ) : null}
        </div>
      ) : null}
    </span>
  );
}
