import { describe, expect, it } from "vitest";

import { getDefaultTemplate } from "@/lib/layout";

import {
  computeKeyboardDimensions,
  computeKeyRects,
  geometryToRect,
} from "./keyboard-layout";

describe("keyboard-layout", () => {
  it("maps KLE geometry to pixel rects", () => {
    const layout = getDefaultTemplate();
    const rects = computeKeyRects(layout);

    expect(rects.length).toBeGreaterThan(50);
    expect(rects[0]?.width).toBeGreaterThan(0);
    expect(rects[0]?.height).toBeGreaterThan(0);
  });

  it("does not use legend alignment for key placement", () => {
    const withLabelAlign = geometryToRect({
      row: 4,
      col: 3,
      x: 3.75,
      y: 4,
      width: 6.25,
      height: 1,
      alignment: 7,
    });
    const withoutLabelAlign = geometryToRect({
      row: 4,
      col: 3,
      x: 3.75,
      y: 4,
      width: 6.25,
      height: 1,
    });

    expect(withLabelAlign.x).toBe(withoutLabelAlign.x);
  });

  it("places bottom-row space and right modifiers sequentially", () => {
    const layout = getDefaultTemplate();
    const rects = computeKeyRects(layout);
    const byId = new Map(rects.map((r) => [r.keyId, r]));

    const altLeft = byId.get("R4C2");
    const space = byId.get("R4C3");
    const altRight = byId.get("R4C4");

    expect(altLeft).toBeDefined();
    expect(space).toBeDefined();
    expect(altRight).toBeDefined();

    expect(space!.x).toBeGreaterThan(altLeft!.x + altLeft!.width - 1);
    expect(altRight!.x).toBeGreaterThan(space!.x + space!.width - 1);
  });

  it("computes canvas dimensions from key rects", () => {
    const layout = getDefaultTemplate();
    const rects = computeKeyRects(layout);
    const dims = computeKeyboardDimensions(rects);

    expect(dims.width).toBeGreaterThan(600);
    expect(dims.height).toBeGreaterThan(200);
  });
});
