import type { Active, CollisionDetection, Over } from "@dnd-kit/core";
import { closestCenter, pointerWithin } from "@dnd-kit/core";

import { parseDragId } from "./constants";

type DragData =
  | { type: "char"; char: string }
  | { type: "key"; keyId: string };

function keyIdFromDndId(id: string | number): string | null {
  const parsed = parseDragId(String(id));
  return parsed.kind === "key" ? parsed.value : null;
}

export function resolveDragChar(active: Active): string | null {
  const data = active.data.current as DragData | undefined;
  if (data?.type === "char") {
    return data.char;
  }

  const parsed = parseDragId(String(active.id));
  return parsed.kind === "char" ? parsed.value : null;
}

export function resolveDragKeyId(active: Active): string | null {
  const data = active.data.current as DragData | undefined;
  if (data?.type === "key") {
    return data.keyId;
  }

  return keyIdFromDndId(active.id);
}

export function resolveDropKeyId(over: Over): string | null {
  const data = over.data.current as DragData | undefined;
  if (data?.type === "key") {
    return data.keyId;
  }

  return keyIdFromDndId(over.id);
}

function isSelfKeyDrop(activeKeyId: string, collisionId: string | number): boolean {
  const dropKeyId = keyIdFromDndId(collisionId);
  return dropKeyId === activeKeyId;
}

/** Prefer pointer position; ignore a key's own drop zone while dragging it. */
export const editorCollisionDetection: CollisionDetection = (args) => {
  const activeKeyId = resolveDragKeyId(args.active);

  const filterCollisions = <T extends { id: string | number }>(hits: T[]) =>
    hits.filter((collision) => {
      if (collision.id === args.active.id) {
        return false;
      }
      if (activeKeyId && isSelfKeyDrop(activeKeyId, collision.id)) {
        return false;
      }
      return true;
    });

  const pointerHits = filterCollisions(pointerWithin(args));
  if (pointerHits.length > 0) {
    return pointerHits;
  }

  return filterCollisions(closestCenter(args));
};

export function pickDropTarget(
  over: Over | null,
  lastOver: Over | null,
): Over | null {
  return over ?? lastOver;
}
