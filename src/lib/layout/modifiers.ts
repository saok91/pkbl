/** Modifier key labels that are never editable in v1. */
export const MODIFIER_LABELS = new Set([
  "Backspace",
  "Tab",
  "Caps Lock",
  "Enter",
  "Shift",
  "Ctrl",
  "Win",
  "Alt",
  "Menu",
  "Fn",
  "Space",
]);

export function isModifierLabel(label: string): boolean {
  return MODIFIER_LABELS.has(label);
}
