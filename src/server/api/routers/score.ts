import { z } from "zod";

import { apiFail, apiOk } from "~/server/api/result";
import { layoutInputSchema } from "~/server/api/schemas/layout";
import {
  corpusPresetIdSchema,
  customTextSchema,
} from "~/server/api/schemas/shared";
import {
  compareLayoutScores,
  evaluateLayoutScore,
  resolveNgramStats,
} from "~/server/api/services/scoring";
import { createTRPCRouter, scoreProcedure } from "~/server/api/trpc";

const evaluateInputSchema = z.object({
  layout: layoutInputSchema,
  corpusPresetId: corpusPresetIdSchema,
  customText: customTextSchema.optional(),
});

const compareInputSchema = z.object({
  layouts: z.array(layoutInputSchema).min(2).max(4),
  corpusPresetId: corpusPresetIdSchema,
  customText: customTextSchema.optional(),
});

export const scoreRouter = createTRPCRouter({
  evaluate: scoreProcedure
    .input(evaluateInputSchema)
    .mutation(async ({ input }) => {
      try {
        const ngramStats = await resolveNgramStats(
          input.corpusPresetId,
          input.customText,
        );
        const result = evaluateLayoutScore(input.layout, ngramStats);
        return apiOk(result);
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "Score evaluation failed";
        return apiFail(message);
      }
    }),

  compare: scoreProcedure
    .input(compareInputSchema)
    .mutation(async ({ input }) => {
      try {
        const ngramStats = await resolveNgramStats(
          input.corpusPresetId,
          input.customText,
        );
        const comparison = compareLayoutScores(input.layouts, ngramStats);
        return apiOk(comparison);
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "Score comparison failed";
        return apiFail(message);
      }
    }),
});
