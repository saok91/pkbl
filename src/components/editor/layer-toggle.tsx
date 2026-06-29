"use client";

import { useCallback, useRef } from "react";

import type { Layer } from "@/lib/layout/types";

type LayerToggleProps = {
  activeLayer: Layer;
  onChange: (layer: Layer) => void;
};

const LAYERS: { id: Layer; label: string }[] = [
  { id: "base", label: "پایه" },
  { id: "shift", label: "شیفت" },
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
      const nextIndex = (direction + index + LAYERS.length) % LAYERS.length;
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
      className="mr-auto flex gap-0.5 rounded-lg border border-border-strong bg-surface-panel p-1"
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
            aria-pressed={isActive}
            onClick={() => onChange(layer.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`rounded px-3 py-1 text-[11px] font-medium transition-all ${
              isActive
                ? layer.id === "base"
                  ? "border border-primary/30 bg-primary/18 text-primary"
                  : "border border-accent/30 bg-accent/18 text-accent"
                : "text-text-faint hover:text-text-dim"
            }`}
          >
            {layer.label}
          </button>
        );
      })}
    </div>
  );
}
