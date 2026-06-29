import { z } from "zod";

import type { CorpusPresetId } from "@/lib/corpus/client-presets";

export const keyGeometryWireSchema = z.object({
  row: z.number().int().nonnegative(),
  col: z.number().int().nonnegative(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  alignment: z.number().int().optional(),
});

export const physicalKeyWireSchema = z.object({
  keyId: z.string().min(1),
  geometry: keyGeometryWireSchema,
  defaultLabel: z.string(),
  modifierLabel: z.string().optional(),
  isEditable: z.boolean(),
});

export const keySlotWireSchema = z.object({
  base: z.string(),
  shift: z.string(),
});

export const layoutWireSchema = z.object({
  templateId: z.string().min(1),
  keys: z.array(z.tuple([z.string(), physicalKeyWireSchema])),
  assignments: z.array(z.tuple([z.string(), keySlotWireSchema])),
  kleStructure: z.array(z.array(z.union([z.string(), z.record(z.unknown())]))),
});

export type LayoutWireParsed = z.infer<typeof layoutWireSchema>;

export const corpusPresetIdSchema = z.enum([
  "wiki-fa",
  "varzesh3",
]) satisfies z.ZodType<CorpusPresetId>;

export const editorDraftSchema = z.object({
  version: z.literal(1),
  savedAt: z.string().datetime(),
  corpusPresetId: corpusPresetIdSchema,
  layout: layoutWireSchema,
});

export type EditorDraftParsed = z.infer<typeof editorDraftSchema>;
