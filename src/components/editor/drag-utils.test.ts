import { describe, expect, it } from "vitest";

import { DRAG_ID } from "./constants";
import {
  editorCollisionDetection,
  resolveDragChar,
  resolveDragKeyId,
  resolveDropKeyId,
} from "./drag-utils";

describe("drag-utils", () => {
  it("resolves char drag from data and id", () => {
    const active = {
      id: DRAG_ID.char("ب"),
      data: { current: { type: "char", char: "ب" } },
      rect: { current: { translated: null, initial: null } },
    };

    expect(resolveDragChar(active as never)).toBe("ب");
  });

  it("resolves key drop from droppable id", () => {
    const over = {
      id: DRAG_ID.dropKey("key-q"),
      data: { current: { type: "key", keyId: "key-q" } },
      rect: null,
      disabled: false,
    };

    expect(resolveDropKeyId(over as never)).toBe("key-q");
  });

  it("filters self drop when dragging a key", () => {
    const collisions = editorCollisionDetection({
      active: {
        id: DRAG_ID.key("key-a"),
        data: { current: { type: "key", keyId: "key-a" } },
        rect: { current: { translated: null, initial: null } },
      },
      collisionRect: {
        top: 0,
        left: 0,
        bottom: 48,
        right: 48,
        width: 48,
        height: 48,
      },
      droppableRects: new Map([
        [
          DRAG_ID.dropKey("key-a"),
          {
            top: 0,
            left: 0,
            bottom: 48,
            right: 48,
            width: 48,
            height: 48,
          },
        ],
        [
          DRAG_ID.dropKey("key-b"),
          {
            top: 0,
            left: 52,
            bottom: 48,
            right: 100,
            width: 48,
            height: 48,
          },
        ],
      ]),
      droppableContainers: [],
      pointerCoordinates: { x: 10, y: 10 },
    } as never);

    const ids = collisions.map((collision) => String(collision.id));
    expect(ids).not.toContain(DRAG_ID.dropKey("key-a"));
  });

  it("resolves drag key id from draggable id", () => {
    const active = {
      id: DRAG_ID.key("key-z"),
      data: { current: undefined },
      rect: { current: { translated: null, initial: null } },
    };

    expect(resolveDragKeyId(active as never)).toBe("key-z");
  });
});
