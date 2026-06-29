import { z } from "zod";

import type { Layout } from "@/lib/layout/types";

const keyGeometrySchema = z.object({
  row: z.number().int().nonnegative(),
  col: z.number().int().nonnegative(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  alignment: z.number().int().optional(),
});

const physicalKeySchema = z.object({
  keyId: z.string().min(1),
  geometry: keyGeometrySchema,
  defaultLabel: z.string(),
  modifierLabel: z.string().optional(),
  isEditable: z.boolean(),
});

const keySlotSchema = z.object({
  base: z.string(),
  shift: z.string(),
});

function isLayout(value: unknown): value is Layout {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Layout;
  return (
    typeof candidate.templateId === "string" &&
    candidate.templateId.length > 0 &&
    candidate.keys instanceof Map &&
    candidate.assignments instanceof Map &&
    Array.isArray(candidate.kleStructure)
  );
}

/** Validates a runtime Layout (Maps preserved via superjson). */
export const layoutSchema = z.custom<Layout>(isLayout, {
  message: "Invalid layout payload",
});

export const layoutWireSchema = z.object({
  templateId: z.string().min(1),
  keys: z.array(z.tuple([z.string(), physicalKeySchema])),
  assignments: z.array(z.tuple([z.string(), keySlotSchema])),
  kleStructure: z.array(z.array(z.union([z.string(), z.record(z.unknown())]))),
});

export type LayoutWire = z.infer<typeof layoutWireSchema>;

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

/** API boundary — validates wire format and converts to runtime Layout. */
export const layoutInputSchema = layoutWireSchema.transform(layoutFromWire);
