"use client";

import { useCallback, useSyncExternalStore } from "react";

import { VIEW_MODE_FA } from "./comprehension-labels";

export type AnalyticsViewMode = "simple" | "expert";

export const ANALYTICS_VIEW_MODE_KEY = "pkbl-analytics-view-mode";
const VIEW_MODE_EVENT = "pkbl-analytics-view-mode-change";

export function isAnalyticsViewMode(value: string): value is AnalyticsViewMode {
  return value === "simple" || value === "expert";
}

export function readStoredViewMode(): AnalyticsViewMode {
  if (typeof window === "undefined") {
    return "simple";
  }
  const stored = localStorage.getItem(ANALYTICS_VIEW_MODE_KEY);
  if (stored && isAnalyticsViewMode(stored)) {
    return stored;
  }
  return "simple";
}

export function writeStoredViewMode(mode: AnalyticsViewMode): void {
  localStorage.setItem(ANALYTICS_VIEW_MODE_KEY, mode);
  window.dispatchEvent(new Event(VIEW_MODE_EVENT));
}

function subscribeViewMode(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange();
  window.addEventListener(VIEW_MODE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(VIEW_MODE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

type ViewModeToggleProps = {
  mode: AnalyticsViewMode;
  onChange: (mode: AnalyticsViewMode) => void;
};

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div
      className="flex w-full gap-0.5"
      role="group"
      aria-label="حالت نمایش پنل امتیاز"
    >
      {(["simple", "expert"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={mode === option}
          onClick={() => onChange(option)}
          className={`focus-visible:ring-primary flex-1 rounded py-1.5 text-[11px] transition-all focus-visible:ring-2 focus-visible:outline-none ${
            mode === option
              ? "text-primary bg-[#0C1E38] shadow-sm"
              : "text-text-faint hover:text-text-dim"
          }`}
        >
          {VIEW_MODE_FA[option]}
        </button>
      ))}
    </div>
  );
}

export function useAnalyticsViewMode(): {
  readonly mode: AnalyticsViewMode;
  readonly setMode: (mode: AnalyticsViewMode) => void;
} {
  const mode = useSyncExternalStore(
    subscribeViewMode,
    () => readStoredViewMode(),
    (): AnalyticsViewMode => "simple",
  );

  const setMode = useCallback((nextMode: AnalyticsViewMode) => {
    writeStoredViewMode(nextMode);
  }, []);

  return { mode, setMode };
}
