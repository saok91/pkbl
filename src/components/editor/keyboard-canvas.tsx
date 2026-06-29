"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import type { Layer, Layout } from "@/lib/layout/types";

import { KEYBOARD_PADDING_PX } from "./constants";
import { getAlternateLabel, getKeyLabel } from "./editor-state";
import { Keycap } from "./keycap";
import {
  computeKeyboardDimensions,
  computeKeyRects,
  computeKeyboardScale,
} from "./keyboard-layout";

type KeyboardCanvasProps = {
  layout: Layout;
  activeLayer: Layer;
  selectedKeyId: string | null;
  openPopoverKeyId: string | null;
  dropHighlightKeyId: string | null;
  hotspotKeyIds?: ReadonlySet<string>;
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
  hotspotKeyIds,
  onKeyClick,
  onPopoverSelect,
  onPopoverClose,
}: KeyboardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const rects = useMemo(() => computeKeyRects(layout), [layout]);
  const dimensions = useMemo(() => computeKeyboardDimensions(rects), [rects]);

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
      if (container.clientWidth <= 0) {
        return;
      }
      const availableWidth = container.clientWidth - KEYBOARD_PADDING_PX * 2;
      setScale(computeKeyboardScale(availableWidth, dimensions.width));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [dimensions.width]);

  const scaledWidth = dimensions.width * scale;
  const scaledHeight = dimensions.height * scale;

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-slate-700 bg-slate-900/50 p-3"
      dir="ltr"
    >
      <div
        className="relative mx-auto"
        style={{ width: scaledWidth, height: scaledHeight }}
      >
        <div
          role="img"
          aria-label="صفحه‌کلید ۶۰٪"
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            transform: `scale(${scale})`,
          }}
        >
          {keyDisplayData.map(({ rect, primaryLabel, alternateLabel }) => {
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
                isHotspot={hotspotKeyIds?.has(rect.keyId) ?? false}
                onClick={() => onKeyClick(rect.keyId)}
                onPopoverSelect={
                  isPopoverOpen
                    ? (char) => onPopoverSelect(rect.keyId, char)
                    : undefined
                }
                onPopoverClose={isPopoverOpen ? onPopoverClose : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
