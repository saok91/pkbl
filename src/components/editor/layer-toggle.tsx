"use client";

import { useCallback, useRef } from "react";

import type { Layer } from "@/lib/layout/types";

type LayerToggleProps = {
  activeLayer: Layer;
  onChange: (layer: Layer) => void;
};

const LAYERS: { id: Layer; label: string; description: string }[] = [
  { id: "base", label: "پایه", description: "Base" },
  { id: "shift", label: "شیفت", description: "Shift" },
];

export function LayerToggle({ activeLayer, onChange }: LayerToggleProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = useCallback((index: number) => {
    tabRefs.current[index]?.focus();
  }, []);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        (index + direction + LAYERS.length) % LAYERS.length;
      const nextLayer = LAYERS[nextIndex];
      if (nextLayer) {
        onChange(nextLayer.id);
        focusTab(nextIndex);
      }
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first = LAYERS[0];
      if (first) {
        onChange(first.id);
        focusTab(0);
      }
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const last = LAYERS[LAYERS.length - 1];
      if (last) {
        onChange(last.id);
        focusTab(LAYERS.length - 1);
      }
    }
  };

  return (
    <div
      className="inline-flex rounded-lg border border-slate-700 bg-slate-800/80 p-1"
      role="tablist"
      aria-label="لایهٔ صفحه‌کلید"
    >
      {LAYERS.map((layer, index) => {
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            onClick={() => onChange(layer.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
            }`}
          >
            <span>{layer.label}</span>
            <span className="mr-2 text-xs opacity-70">{layer.description}</span>
          </button>
        );
      })}
    </div>
  );
}
