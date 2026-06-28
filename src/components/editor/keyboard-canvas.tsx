"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import type { Layer, Layout } from "@/lib/layout/types";

import { KEYBOARD_PADDING_PX } from "./constants";
import { getAlternateLabel, getKeyLabel } from "./editor-state";
import { Keycap } from "./keycap";
import {
  computeKeyboardDimensions,
  computeKeyRects,
} from "./keyboard-layout";

type KeyboardCanvasProps = {
  layout: Layout;
  activeLayer: Layer;
  selectedKeyId: string | null;
  openPopoverKeyId: string | null;
  dropHighlightKeyId: string | null;
  onKeyClick: (keyId: string) => void;
  onPopoverSelect: (keyId: string, char: string) => void;
  onPopoverClose: () => void;
};

export function KeyboardCanvas({
  layout,
  activeLayer,
  selectedKeyId,
  openPopoverKeyId,
  dropHighlightKeyId,
  onKeyClick,
  onPopoverSelect,
  onPopoverClose,
}: KeyboardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const rects = useMemo(() => computeKeyRects(layout), [layout]);
  const dimensions = useMemo(
    () => computeKeyboardDimensions(rects),
    [rects],
  );

  const keyDisplayData = useMemo(
    () =>
      rects.map((rect) => ({
        rect,
        primaryLabel: getKeyLabel(layout, rect.keyId, activeLayer),
        alternateLabel: getAlternateLabel(layout, rect.keyId, activeLayer),
      })),
    [activeLayer, layout, rects],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateScale = () => {
      const availableWidth =
        container.clientWidth - KEYBOARD_PADDING_PX * 2;
      const nextScale = Math.min(
        1.45,
        Math.max(1, availableWidth / dimensions.width),
      );
      setScale(nextScale);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [dimensions.width]);

  const scaledHeight = dimensions.height * scale;

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-slate-700 bg-slate-900/50 p-4"
      dir="ltr"
    >
      <div
        className="relative mx-auto overflow-visible"
        style={{ width: "100%", height: scaledHeight }}
      >
        <div
          role="img"
          aria-label="صفحه‌کلید ۶۰٪"
          className="absolute top-0 left-1/2 origin-top"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            transform: `translateX(-50%) scale(${scale})`,
          }}
        >
          {keyDisplayData.map(
            ({ rect, primaryLabel, alternateLabel }) => {
              const isPopoverOpen = openPopoverKeyId === rect.keyId;
              return (
                <Keycap
                  key={rect.keyId}
                  rect={rect}
                  primaryLabel={primaryLabel}
                  alternateLabel={alternateLabel}
                  activeLayer={activeLayer}
                  isSelected={selectedKeyId === rect.keyId}
                  isPopoverOpen={isPopoverOpen}
                  isDropHighlight={dropHighlightKeyId === rect.keyId}
                  onClick={() => onKeyClick(rect.keyId)}
                  onPopoverSelect={
                    isPopoverOpen
                      ? (char) => onPopoverSelect(rect.keyId, char)
                      : undefined
                  }
                  onPopoverClose={isPopoverOpen ? onPopoverClose : undefined}
                />
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}
