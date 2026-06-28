import { extractCharsetFromKle } from "./layout-charset";
import { isModifierLabel, MODIFIER_LABELS } from "./modifiers";
import { PERSIAN_STANDARD_60_KLE } from "./persian-standard-60";

/** All assignable chars from Persian Standard (base + shift layers). */
export const EDITABLE_CHARSET = extractCharsetFromKle(PERSIAN_STANDARD_60_KLE);

export const EDITABLE_CHARSET_SET = new Set(EDITABLE_CHARSET);

export { MODIFIER_LABELS, isModifierLabel };

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

export function isKeyEditable(label: string): boolean {
  // Spacebar uses empty label; all other non-modifier keys are editable in v1.
  return !isModifierLabel(label);
}
