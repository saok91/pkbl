import { z } from "zod";

import type { CorpusPresetId } from "@/lib/corpus/client-presets";

export const MAX_LAYOUT_KEYS = 128;
export const MAX_KLE_ROWS = 64;
export const MAX_KLE_ROW_ITEMS = 32;
export const MAX_KEY_LABEL_LENGTH = 32;
export const MAX_KLE_CELL_STRING_LENGTH = 256;

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
  keyId: z.string().min(1).max(64),
  geometry: keyGeometryWireSchema,
  defaultLabel: z.string().max(MAX_KEY_LABEL_LENGTH),
  modifierLabel: z.string().max(MAX_KEY_LABEL_LENGTH).optional(),
  isEditable: z.boolean(),
});

export const keySlotWireSchema = z.object({
  base: z.string().max(MAX_KEY_LABEL_LENGTH),
  shift: z.string().max(MAX_KEY_LABEL_LENGTH),
});

export const layoutWireSchema = z.object({
  templateId: z.string().min(1).max(128),
  keys: z
    .array(z.tuple([z.string().min(1).max(64), physicalKeyWireSchema]))
    .max(MAX_LAYOUT_KEYS),
  assignments: z
    .array(z.tuple([z.string().min(1).max(64), keySlotWireSchema]))
    .max(MAX_LAYOUT_KEYS),
  kleStructure: z
    .array(
      z
        .array(
          z.union([
            z.string().max(MAX_KLE_CELL_STRING_LENGTH),
            z.record(z.unknown()),
          ]),
        )
        .max(MAX_KLE_ROW_ITEMS),
    )
    .max(MAX_KLE_ROWS),
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
