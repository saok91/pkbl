/** Persian letters (32) + common symbols + digits for v1 editable scope. */
const PERSIAN_LETTERS = "ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی" as const;

const PERSIAN_PUNCTUATION = "«»؛؟،" as const;

const ZWNJ = "\u200c";

const DIGITS = "0123456789۰۱۲۳۴۵۶۷۸۹" as const;

export const EDITABLE_CHARSET = [
  ...PERSIAN_LETTERS,
  ...PERSIAN_PUNCTUATION,
  ZWNJ,
  ...DIGITS,
].join("");

export const EDITABLE_CHARSET_SET = new Set(EDITABLE_CHARSET);

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

/** True when `value` is exactly one Unicode code point (handles surrogate pairs). */
export function isSingleCodePoint(value: string): boolean {
  return [...value].length === 1;
}

export function isCharInEditableScope(char: string): boolean {
  if (!isSingleCodePoint(char)) {
    return false;
  }
  return EDITABLE_CHARSET_SET.has(char);
}

export function isModifierLabel(label: string): boolean {
  return MODIFIER_LABELS.has(label);
}

export function isKeyEditable(label: string): boolean {
  // Spacebar uses empty label; all other non-modifier keys are editable in v1.
  return !isModifierLabel(label);
}
