export {
  EDITABLE_CHARSET,
  EDITABLE_CHARSET_SET,
  MODIFIER_LABELS,
  isCharInEditableScope,
  isKeyEditable,
  isModifierLabel,
} from "./editable-scope";

export {
  getDefaultTemplate,
  layoutsEquivalent,
  parseKle,
  parseKleJson,
  parseLabelLayers,
  serializeKle,
  serializeKleStructure,
} from "./kle-parser";

export { TEMPLATE_60_ANSI_ID, TEMPLATE_60_ANSI_KLE } from "./template-60-ansi";

export {
  assignChar,
  getAssignedChars,
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

/** Domain module marker for boundary tests. */
export const LAYOUT_MODULE = "layout" as const;
