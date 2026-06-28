export type Layer = "base" | "shift";

export type KleModifier = {
  a?: number;
  w?: number;
  h?: number;
  f?: number;
  fa?: number;
  p?: string;
  c?: string;
  t?: string;
  n?: boolean;
  d?: boolean;
  rx?: number;
  ry?: number;
};

export type KleRowItem = string | KleModifier;

export type KleRaw = KleRowItem[][];

export type KeyGeometry = {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  alignment?: number;
};

export type PhysicalKey = {
  keyId: string;
  geometry: KeyGeometry;
  /** Original KLE label string (may contain `\n` for shift/base). */
  defaultLabel: string;
  /** Fixed label for non-editable modifier keys (e.g. Tab, Shift). */
  modifierLabel?: string;
  isEditable: boolean;
};

export type KeySlot = {
  base: string;
  shift: string;
};

export type Layout = {
  templateId: string;
  keys: ReadonlyMap<string, PhysicalKey>;
  assignments: ReadonlyMap<string, KeySlot>;
  /** Parsed KLE structure used for geometry-preserving serialize. */
  kleStructure: KleRaw;
};

export type LayoutErrorCode =
  | "INVALID_JSON"
  | "INVALID_STRUCTURE"
  | "UNSUPPORTED_KLE_FEATURE"
  | "CHAR_NOT_IN_SCOPE"
  | "KEY_NOT_EDITABLE"
  | "KEY_NOT_FOUND";

export class LayoutError extends Error {
  constructor(
    public readonly code: LayoutErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "LayoutError";
  }
}
