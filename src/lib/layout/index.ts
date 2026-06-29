export {
  EDITABLE_CHARSET,
  EDITABLE_CHARSET_SET,
  isCharInEditableScope,
  isKeyEditable,
} from "./editable-scope";

export {
  buildPaletteSections,
  flattenPaletteSections,
} from "./palette-charset";
export type { PaletteSection } from "./palette-charset";

export {
  getCharDescription,
  getCharDisplayLabel,
  hasCustomCharLabel,
} from "./charset-labels";

export {
  MODIFIER_LABELS,
  SHIFT_MODIFIER_LABEL,
  isModifierLabel,
  isShiftModifierKey,
} from "./modifiers";

export {
  getBlankAnsiTemplate,
  getDefaultTemplate,
  layoutsEquivalent,
  parseKle,
  parseKleJson,
  parseLabelLayers,
  serializeKle,
  serializeKleStructure,
} from "./kle-parser";

export {
  PERSIAN_STANDARD_60_ID,
  PERSIAN_STANDARD_60_KLE,
  PERSIAN_STANDARD_60_NAME,
} from "./persian-standard-60";

export { TEMPLATE_60_ANSI_ID, TEMPLATE_60_ANSI_KLE } from "./template-60-ansi";

export {
  assignChar,
  getAssignedChars,
  getAssignedCharsForLayer,
  resetAllEditable,
  resetKey,
  swapKeys,
} from "./operations";

export {
  getCompletenessScore,
  getDuplicateAssignments,
  getUnassignedChars,
} from "./analysis";

export type { DuplicateAssignment } from "./analysis";

export type {
  KeyGeometry,
  KeySlot,
  KleModifier,
  KleRaw,
  KleRowItem,
  Layer,
  Layout,
  LayoutErrorCode,
  PhysicalKey,
} from "./types";

export { LayoutError } from "./types";

export {
  layoutFromWire,
  layoutToWire,
} from "./wire";

export type {
  KeyGeometryWire,
  KeySlotWire,
  LayoutWire,
  PhysicalKeyWire,
} from "./wire";

export {
  editorDraftSchema,
  layoutWireSchema,
} from "./wire-schema";

export type { EditorDraftParsed, LayoutWireParsed } from "./wire-schema";

/** Domain module marker for boundary tests. */
export const LAYOUT_MODULE = "layout" as const;
