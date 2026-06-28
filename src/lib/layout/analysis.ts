import { EDITABLE_CHARSET_SET } from "./editable-scope";
import { getAssignedChars } from "./operations";
import type { Layout } from "./types";

export function getUnassignedChars(layout: Layout, charset: string): string[] {
  const assigned = new Set(getAssignedChars(layout));
  const unassigned: string[] = [];

  for (const char of charset) {
    if (!assigned.has(char)) {
      unassigned.push(char);
    }
  }

  return unassigned;
}

export type DuplicateAssignment = {
  char: string;
  keyIds: string[];
  layer: "base" | "shift";
};

export function getDuplicateAssignments(layout: Layout): DuplicateAssignment[] {
  const charToKeys = new Map<
    string,
    { char: string; keyIds: string[]; layer: "base" | "shift" }
  >();

  for (const [keyId, key] of layout.keys) {
    if (!key.isEditable) {
      continue;
    }
    const slot = layout.assignments.get(keyId);
    if (!slot) {
      continue;
    }

    if (slot.base) {
      const mapKey = `base:${slot.base}`;
      const entry = charToKeys.get(mapKey) ?? {
        char: slot.base,
        keyIds: [],
        layer: "base" as const,
      };
      entry.keyIds.push(keyId);
      charToKeys.set(mapKey, entry);
    }

    if (slot.shift) {
      const mapKey = `shift:${slot.shift}`;
      const entry = charToKeys.get(mapKey) ?? {
        char: slot.shift,
        keyIds: [],
        layer: "shift" as const,
      };
      entry.keyIds.push(keyId);
      charToKeys.set(mapKey, entry);
    }
  }

  return [...charToKeys.values()].filter((entry) => entry.keyIds.length > 1);
}

export function getCompletenessScore(layout: Layout, charset?: string): number {
  const targetCharset = charset ?? [...EDITABLE_CHARSET_SET].join("");
  if (targetCharset.length === 0) {
    return 100;
  }

  const unassigned = getUnassignedChars(layout, targetCharset);
  const assignedCount = targetCharset.length - unassigned.length;
  return Math.round((assignedCount / targetCharset.length) * 100);
}
