import { z } from "zod";

import { analyzeCustomText } from "@/lib/corpus/analyze-custom";
import { listPresets } from "@/lib/corpus/presets";
import { ngramStatsToArtifact } from "@/lib/corpus/serialize";

import { apiFail, apiOk } from "~/server/api/result";
import { customTextSchema } from "~/server/api/schemas/shared";
import { createTRPCRouter, corpusAnalyzeProcedure, publicProcedure } from "~/server/api/trpc";

const analyzeCustomInputSchema = z.object({
  text: customTextSchema.min(1, "Text is required"),
});

export const corpusRouter = createTRPCRouter({
  listPresets: publicProcedure.query(() => {
    return apiOk(listPresets());
  }),

  analyzeCustom: corpusAnalyzeProcedure
    .input(analyzeCustomInputSchema)
    .mutation(({ input }) => {
      try {
        const stats = analyzeCustomText(input.text);
        const artifact = ngramStatsToArtifact(
          stats,
          "custom",
          new Date().toISOString(),
        );
        return apiOk(artifact);
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "Corpus analysis failed";
        return apiFail(message);
      }
    }),
});
