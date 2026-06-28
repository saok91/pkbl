import { isKeyEditable, isModifierLabel } from "./editable-scope";
import { TEMPLATE_60_ANSI_ID, TEMPLATE_60_ANSI_KLE } from "./template-60-ansi";
import type {
  KeyGeometry,
  KeySlot,
  KleModifier,
  KleRaw,
  KleRowItem,
  Layout,
  PhysicalKey,
} from "./types";
import { LayoutError } from "./types";

const UNSUPPORTED_MODIFIER_KEYS = new Set([
  "x",
  "y",
  "f",
  "fa",
  "p",
  "c",
  "t",
  "n",
  "d",
  "rx",
  "ry",
]);

function isModifierObject(item: KleRowItem): item is KleModifier {
  return typeof item === "object" && item !== null;
}

function assertSupportedModifiers(mod: KleModifier): void {
  for (const key of Object.keys(mod)) {
    if (UNSUPPORTED_MODIFIER_KEYS.has(key)) {
      throw new LayoutError(
        "UNSUPPORTED_KLE_FEATURE",
        `Unsupported KLE modifier: ${key}`,
      );
    }
  }
}

function parseLabelLayers(label: string): KeySlot {
  const parts = label.split("\n");
  if (parts.length === 1) {
    return { shift: "", base: parts[0] ?? "" };
  }
  return {
    shift: parts[0] ?? "",
    base: parts[1] ?? "",
  };
}

function buildLabelFromSlot(slot: KeySlot, defaultLabel: string): string {
  const defaultSlot = parseLabelLayers(defaultLabel);
  const shift = slot.shift || defaultSlot.shift;
  const base = slot.base;

  if (shift && shift !== base) {
    return `${shift}\n${base}`;
  }
  if (defaultLabel.includes("\n") && shift) {
    return `${shift}\n${base}`;
  }
  return base;
}

type ParsedRowKey = {
  keyId: string;
  geometry: KeyGeometry;
  defaultLabel: string;
  modifierLabel?: string;
  isEditable: boolean;
  slot: KeySlot;
  rowIndex: number;
  itemIndex: number;
};

function parseKleStructure(structure: KleRaw): {
  keys: Map<string, PhysicalKey>;
  assignments: Map<string, KeySlot>;
  keyOrder: ParsedRowKey[];
} {
  const keys = new Map<string, PhysicalKey>();
  const assignments = new Map<string, KeySlot>();
  const keyOrder: ParsedRowKey[] = [];

  for (let rowIndex = 0; rowIndex < structure.length; rowIndex++) {
    const row = structure[rowIndex];
    if (!Array.isArray(row)) {
      throw new LayoutError(
        "INVALID_STRUCTURE",
        `Row ${rowIndex} is not an array`,
      );
    }

    let x = 0;
    let col = 0;
    let pending: KleModifier = {};

    for (let itemIndex = 0; itemIndex < row.length; itemIndex++) {
      const item = row[itemIndex];
      if (item === undefined) {
        continue;
      }

      if (isModifierObject(item)) {
        assertSupportedModifiers(item);
        pending = { ...pending, ...item };
        continue;
      }

      if (typeof item !== "string") {
        throw new LayoutError(
          "INVALID_STRUCTURE",
          `Unexpected item at row ${rowIndex}, index ${itemIndex}`,
        );
      }

      const width = pending.w ?? 1;
      const height = pending.h ?? 1;
      const alignment = pending.a;
      const keyId = `R${rowIndex}C${col}`;
      const slot = parseLabelLayers(item);
      const editable = isKeyEditable(item);
      const modifierLabel = isModifierLabel(item) ? item : undefined;

      const geometry: KeyGeometry = {
        row: rowIndex,
        col,
        x,
        y: rowIndex,
        width,
        height,
        ...(alignment !== undefined ? { alignment } : {}),
      };

      const physicalKey: PhysicalKey = {
        keyId,
        geometry,
        defaultLabel: item,
        ...(modifierLabel !== undefined ? { modifierLabel } : {}),
        isEditable: editable,
      };

      keys.set(keyId, physicalKey);
      assignments.set(keyId, { ...slot });
      keyOrder.push({
        keyId,
        geometry,
        defaultLabel: item,
        ...(modifierLabel !== undefined ? { modifierLabel } : {}),
        isEditable: editable,
        slot: { ...slot },
        rowIndex,
        itemIndex,
      });

      x += width;
      col += 1;
      pending = {};
    }
  }

  return { keys, assignments, keyOrder };
}

function cloneKleStructure(structure: KleRaw): KleRaw {
  return structure.map((row) =>
    row.map((item) => (typeof item === "string" ? item : { ...item })),
  );
}

function validateKleStructure(value: unknown): KleRaw {
  if (!Array.isArray(value)) {
    throw new LayoutError("INVALID_STRUCTURE", "KLE root must be an array");
  }

  for (const row of value) {
    if (!Array.isArray(row)) {
      throw new LayoutError(
        "INVALID_STRUCTURE",
        "Each KLE row must be an array",
      );
    }
    for (const item of row) {
      if (typeof item === "string") {
        continue;
      }
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        continue;
      }
      throw new LayoutError(
        "INVALID_STRUCTURE",
        "KLE row items must be strings or modifier objects",
      );
    }
  }

  return value as KleRaw;
}

export function parseKleJson(
  structure: unknown,
  templateId: string = TEMPLATE_60_ANSI_ID,
): Layout {
  const kleStructure = validateKleStructure(structure);
  const { keys, assignments } = parseKleStructure(kleStructure);

  return {
    templateId,
    keys,
    assignments,
    kleStructure: cloneKleStructure(kleStructure),
  };
}

export function parseKle(
  raw: string,
  templateId: string = TEMPLATE_60_ANSI_ID,
): Layout {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new LayoutError("INVALID_JSON", "KLE input is not valid JSON");
  }
  return parseKleJson(parsed, templateId);
}

export function getDefaultTemplate(): Layout {
  return parseKleJson(TEMPLATE_60_ANSI_KLE, TEMPLATE_60_ANSI_ID);
}

export function serializeKleStructure(
  layout: Layout,
  assignments: ReadonlyMap<string, KeySlot>,
): KleRaw {
  const output = cloneKleStructure(layout.kleStructure);

  for (let rowIndex = 0; rowIndex < output.length; rowIndex++) {
    const row = output[rowIndex];
    if (!row) {
      continue;
    }

    let col = 0;
    for (let itemIndex = 0; itemIndex < row.length; itemIndex++) {
      const item = row[itemIndex];
      if (item === undefined || isModifierObject(item)) {
        continue;
      }

      const keyId = `R${rowIndex}C${col}`;
      const key = layout.keys.get(keyId);
      if (key?.isEditable) {
        const slot = assignments.get(keyId) ?? { base: "", shift: "" };
        row[itemIndex] = buildLabelFromSlot(slot, key.defaultLabel);
      }

      col += 1;
    }
  }

  return output;
}

export function serializeKle(layout: Layout): string {
  const structure = serializeKleStructure(layout, layout.assignments);
  return JSON.stringify(structure);
}

/** Compare layouts for round-trip equivalence (geometry + assignments). */
export function layoutsEquivalent(a: Layout, b: Layout): boolean {
  if (a.templateId !== b.templateId) {
    return false;
  }
  if (a.keys.size !== b.keys.size) {
    return false;
  }

  for (const [keyId, keyA] of a.keys) {
    const keyB = b.keys.get(keyId);
    if (!keyB) {
      return false;
    }
    const gA = keyA.geometry;
    const gB = keyB.geometry;
    if (
      gA.row !== gB.row ||
      gA.col !== gB.col ||
      gA.x !== gB.x ||
      gA.y !== gB.y ||
      gA.width !== gB.width ||
      gA.height !== gB.height ||
      gA.alignment !== gB.alignment
    ) {
      return false;
    }
    if (keyA.isEditable !== keyB.isEditable) {
      return false;
    }
  }

  for (const [keyId, slotA] of a.assignments) {
    const slotB = b.assignments.get(keyId);
    if (slotA.base !== slotB?.base || slotA.shift !== slotB?.shift) {
      return false;
    }
  }

  return true;
}

export { parseLabelLayers, buildLabelFromSlot };
