import { isCharInEditableScope, isSingleCodePoint } from "./editable-scope";
import { parseLabelLayers, serializeKleStructure } from "./kle-parser";
import type { KeySlot, Layer, Layout } from "./types";
import { LayoutError } from "./types";

function cloneLayout(
  layout: Layout,
  assignments: Map<string, KeySlot>,
): Layout {
  return {
    templateId: layout.templateId,
    keys: layout.keys,
    assignments,
    kleStructure: serializeKleStructure(layout, assignments),
  };
}

function getEditableKey(layout: Layout, keyId: string) {
  const key = layout.keys.get(keyId);
  if (!key) {
    throw new LayoutError("KEY_NOT_FOUND", `Key not found: ${keyId}`);
  }
  if (!key.isEditable) {
    throw new LayoutError("KEY_NOT_EDITABLE", `Key ${keyId} is not editable`);
  }
  return key;
}

function getSlot(layout: Layout, keyId: string): KeySlot {
  return (
    layout.assignments.get(keyId) ?? {
      base: "",
      shift: "",
    }
  );
}

function validateChar(char: string): void {
  if (!isSingleCodePoint(char)) {
    throw new LayoutError(
      "CHAR_NOT_IN_SCOPE",
      "Character must be exactly one Unicode code point",
    );
  }
  if (!isCharInEditableScope(char)) {
    throw new LayoutError(
      "CHAR_NOT_IN_SCOPE",
      `Character "${char}" is not in editable scope`,
    );
  }
}

export function assignChar(
  layout: Layout,
  keyId: string,
  layer: Layer,
  char: string,
): Layout {
  getEditableKey(layout, keyId);
  validateChar(char);

  const assignments = new Map(layout.assignments);
  const current = getSlot(layout, keyId);
  const next: KeySlot =
    layer === "base" ? { ...current, base: char } : { ...current, shift: char };

  assignments.set(keyId, next);
  return cloneLayout(layout, assignments);
}

export function swapKeys(
  layout: Layout,
  keyA: string,
  keyB: string,
  layer?: Layer,
): Layout {
  getEditableKey(layout, keyA);
  getEditableKey(layout, keyB);

  const assignments = new Map(layout.assignments);
  const slotA = getSlot(layout, keyA);
  const slotB = getSlot(layout, keyB);

  if (layer === undefined) {
    assignments.set(keyA, { ...slotB });
    assignments.set(keyB, { ...slotA });
  } else if (layer === "base") {
    assignments.set(keyA, { ...slotA, base: slotB.base });
    assignments.set(keyB, { ...slotB, base: slotA.base });
  } else {
    assignments.set(keyA, { ...slotA, shift: slotB.shift });
    assignments.set(keyB, { ...slotB, shift: slotA.shift });
  }

  return cloneLayout(layout, assignments);
}

export function resetKey(layout: Layout, keyId: string, layer?: Layer): Layout {
  const key = getEditableKey(layout, keyId);
  const defaultSlot = parseLabelLayers(key.defaultLabel);
  const assignments = new Map(layout.assignments);
  const current = getSlot(layout, keyId);

  if (layer === undefined) {
    assignments.set(keyId, { ...defaultSlot });
  } else if (layer === "base") {
    assignments.set(keyId, { ...current, base: defaultSlot.base });
  } else {
    assignments.set(keyId, { ...current, shift: defaultSlot.shift });
  }

  return cloneLayout(layout, assignments);
}

export function resetAllEditable(layout: Layout): Layout {
  const assignments = new Map(layout.assignments);

  for (const [keyId, key] of layout.keys) {
    if (!key.isEditable) {
      continue;
    }
    assignments.set(keyId, parseLabelLayers(key.defaultLabel));
  }

  return cloneLayout(layout, assignments);
}

/** Collect all assigned characters from editable keys (both layers). */
export function getAssignedChars(layout: Layout): string[] {
  const chars: string[] = [];

  for (const [keyId, key] of layout.keys) {
    if (!key.isEditable) {
      continue;
    }
    const slot = getSlot(layout, keyId);
    if (slot.base) {
      chars.push(slot.base);
    }
    if (slot.shift) {
      chars.push(slot.shift);
    }
  }

  return chars;
}
