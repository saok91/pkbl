import { z } from "zod";

export { corpusPresetIdSchema } from "@/lib/layout/wire-schema";

export type { CorpusPresetId } from "@/lib/corpus/client-presets";

export const MAX_CUSTOM_CORPUS_TEXT_CHARS = 50_000;

export const customTextSchema = z
  .string()
  .max(MAX_CUSTOM_CORPUS_TEXT_CHARS, "Custom text exceeds 50KB limit");

export const aliasSchema = z.string().trim().min(1).max(64).optional();
