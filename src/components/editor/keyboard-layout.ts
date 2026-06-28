import type { KeyGeometry, Layout, PhysicalKey } from "@/lib/layout/types";

import {
  KEY_GAP_PX,
  KEY_UNIT_PX,
  KEYBOARD_PADDING_PX,
} from "./constants";

export type KeyRect = {
  keyId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  key: PhysicalKey;
};

function unitToPx(units: number): number {
  if (units <= 0) {
    return 0;
  }
  return units * KEY_UNIT_PX + (units - 1) * KEY_GAP_PX;
}

export function geometryToRect(geometry: KeyGeometry): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  // KLE `a` is legend alignment (stored as geometry.alignment), not horizontal
  // placement — keys advance sequentially via geometry.x in the parser.
  const x = geometry.x * (KEY_UNIT_PX + KEY_GAP_PX);
  const y = geometry.y * (KEY_UNIT_PX + KEY_GAP_PX);

  return {
    x,
    y,
    width: unitToPx(geometry.width),
    height: unitToPx(geometry.height),
  };
}

export function computeKeyRects(layout: Layout): KeyRect[] {
  const rects: KeyRect[] = [];

  for (const [keyId, key] of layout.keys) {
    const rect = geometryToRect(key.geometry);
    rects.push({
      keyId,
      ...rect,
      key,
    });
  }

  return rects.sort((a, b) => {
    if (a.y !== b.y) {
      return a.y - b.y;
    }
    return a.x - b.x;
  });
}

export function computeKeyboardDimensions(rects: KeyRect[]): {
  width: number;
  height: number;
} {
  if (rects.length === 0) {
    return {
      width: KEYBOARD_PADDING_PX * 2,
      height: KEYBOARD_PADDING_PX * 2,
    };
  }

  let maxRight = 0;
  let maxBottom = 0;

  for (const rect of rects) {
    maxRight = Math.max(maxRight, rect.x + rect.width);
    maxBottom = Math.max(maxBottom, rect.y + rect.height);
  }

  return {
    width: maxRight + KEYBOARD_PADDING_PX * 2,
    height: maxBottom + KEYBOARD_PADDING_PX * 2,
  };
}
