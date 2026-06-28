"use client";

import {
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Layer, Layout } from "@/lib/layout/types";

import { KEY_UNIT_PX } from "./constants";
import {
  pickDropTarget,
  resolveDragChar,
  resolveDragKeyId,
  resolveDropKeyId,
} from "./drag-utils";
import { getKeyLabel } from "./editor-state";

const DROP_HIGHLIGHT_MS = 700;

export type ActiveDrag =
  | { kind: "char"; char: string }
  | {
      kind: "key";
      keyId: string;
      label: string;
      width: number;
      height: number;
    };

type UseEditorDnDOptions = {
  layout: Layout;
  activeLayer: Layer;
  assignChar: (keyId: string, char: string) => void;
  swapKeys: (keyA: string, keyB: string) => void;
  selectKey: (keyId: string | null) => void;
};

export function useEditorDnD({
  layout,
  activeLayer,
  assignChar,
  swapKeys,
  selectKey,
}: UseEditorDnDOptions) {
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [dropHighlightKeyId, setDropHighlightKeyId] = useState<string | null>(
    null,
  );
  const lastOverRef = useRef<DragOverEvent["over"]>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  useEffect(() => {
    if (!dropHighlightKeyId) {
      return;
    }
    const timer = window.setTimeout(
      () => setDropHighlightKeyId(null),
      DROP_HIGHLIGHT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [dropHighlightKeyId]);

  const flashDropTarget = useCallback((keyId: string) => {
    setDropHighlightKeyId(keyId);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    if (event.over) {
      lastOverRef.current = event.over;
    }
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      lastOverRef.current = null;

      const data = event.active.data.current as
        | { type: "char"; char: string }
        | {
            type: "key";
            keyId: string;
            label: string;
            width: number;
            height: number;
          }
        | undefined;

      if (data?.type === "char") {
        setActiveDrag({ kind: "char", char: data.char });
        return;
      }

      if (data?.type === "key") {
        setActiveDrag({
          kind: "key",
          keyId: data.keyId,
          label: data.label,
          width: data.width,
          height: data.height,
        });
        return;
      }

      const char = resolveDragChar(event.active);
      if (char) {
        setActiveDrag({ kind: "char", char });
        return;
      }

      const keyId = resolveDragKeyId(event.active);
      if (keyId) {
        const key = layout.keys.get(keyId);
        const geometry = key?.geometry;
        setActiveDrag({
          kind: "key",
          keyId,
          label: getKeyLabel(layout, keyId, activeLayer),
          width: geometry?.width ? geometry.width * KEY_UNIT_PX : KEY_UNIT_PX,
          height: geometry?.height
            ? geometry.height * KEY_UNIT_PX
            : KEY_UNIT_PX,
        });
      }
    },
    [activeLayer, layout],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active } = event;
      const over = pickDropTarget(event.over, lastOverRef.current);
      lastOverRef.current = null;
      setActiveDrag(null);

      if (!over) {
        return;
      }

      const char = resolveDragChar(active);
      const dropKeyId = resolveDropKeyId(over);

      if (char && dropKeyId) {
        assignChar(dropKeyId, char);
        flashDropTarget(dropKeyId);
        return;
      }

      const sourceKeyId = resolveDragKeyId(active);
      if (sourceKeyId && dropKeyId && sourceKeyId !== dropKeyId) {
        swapKeys(sourceKeyId, dropKeyId);
        flashDropTarget(dropKeyId);
        selectKey(dropKeyId);
      }
    },
    [assignChar, flashDropTarget, selectKey, swapKeys],
  );

  const handleDragCancel = useCallback(() => {
    lastOverRef.current = null;
    setActiveDrag(null);
  }, []);

  return {
    sensors,
    activeDrag,
    dropHighlightKeyId,
    flashDropTarget,
    measuring: {
      droppable: {
        strategy: MeasuringStrategy.Always,
      },
    },
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
