import type { KleRaw, Layout } from "./types";

export type KeyGeometryWire = {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  alignment?: number;
};

export type PhysicalKeyWire = {
  keyId: string;
  geometry: KeyGeometryWire;
  defaultLabel: string;
  modifierLabel?: string;
  isEditable: boolean;
};

export type KeySlotWire = {
  base: string;
  shift: string;
};

export type LayoutWire = {
  templateId: string;
  keys: [string, PhysicalKeyWire][];
  assignments: [string, KeySlotWire][];
  kleStructure: KleRaw;
};

export function layoutFromWire(wire: LayoutWire): Layout {
  return {
    templateId: wire.templateId,
    keys: new Map(wire.keys),
    assignments: new Map(wire.assignments),
    kleStructure: wire.kleStructure,
  };
}

export function layoutToWire(layout: Layout): LayoutWire {
  return {
    templateId: layout.templateId,
    keys: [...layout.keys.entries()],
    assignments: [...layout.assignments.entries()],
    kleStructure: layout.kleStructure,
  };
}
