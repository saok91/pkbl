/** Max content width for the editor shell (header + main). */
export const EDITOR_MAX_WIDTH_CLASS = "max-w-7xl";

/** Pixel width of one KLE unit (standard key width). */
export const KEY_UNIT_PX = 56;

/** Gap between adjacent keys in pixels. */
export const KEY_GAP_PX = 5;

/** Keyboard canvas padding in pixels. */
export const KEYBOARD_PADDING_PX = 16;

export const MAX_UNDO_STEPS = 20;

export const DRAG_ID = {
  char: (char: string) => `drag-char-${encodeURIComponent(char)}`,
  key: (keyId: string) => `drag-key-${keyId}`,
  dropKey: (keyId: string) => `drop-key-${keyId}`,
} as const;

export function parseDragId(id: string): {
  kind: "char" | "key" | "unknown";
  value: string;
} {
  if (id.startsWith("drag-char-")) {
    return {
      kind: "char",
      value: decodeURIComponent(id.slice("drag-char-".length)),
    };
  }
  if (id.startsWith("drag-key-")) {
    return {
      kind: "key",
      value: id.slice("drag-key-".length),
    };
  }
  if (id.startsWith("drop-key-")) {
    return {
      kind: "key",
      value: id.slice("drop-key-".length),
    };
  }
  return { kind: "unknown", value: id };
}
