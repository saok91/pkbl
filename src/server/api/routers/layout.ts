import { z } from "zod";

import {
  getDefaultTemplate,
  parseKle,
  serializeKle,
} from "@/lib/layout";
import { LayoutError } from "@/lib/layout/types";
import type { PlacementSuggestion } from "@/lib/leaderboard/types";

import { apiFail, apiOk } from "~/server/api/result";
import { layoutInputSchema } from "~/server/api/schemas/layout";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const parseKleInputSchema = z.object({
  raw: z.string().min(1),
});

const serializeInputSchema = z.object({
  layout: layoutInputSchema,
});

const suggestPlacementsInputSchema = z.object({
  layout: layoutInputSchema,
  unassigned: z.array(z.string().min(1)).max(128),
});

/** Stub until E11 — returns empty suggestions. */
function suggestPlacementsStub(): readonly PlacementSuggestion[] {
  return [];
}

export const layoutRouter = createTRPCRouter({
  getDefaultTemplate: publicProcedure.query(() => {
    return apiOk(getDefaultTemplate());
  }),

  parseKle: publicProcedure
    .input(parseKleInputSchema)
    .mutation(({ input }) => {
      try {
        return apiOk(parseKle(input.raw));
      } catch (cause) {
        if (cause instanceof LayoutError) {
          return apiFail(cause.message);
        }
        const message =
          cause instanceof Error ? cause.message : "KLE parse failed";
        return apiFail(message);
      }
    }),

  serialize: publicProcedure
    .input(serializeInputSchema)
    .query(({ input }) => {
      try {
        return apiOk({ kle: serializeKle(input.layout) });
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "KLE serialize failed";
        return apiFail(message);
      }
    }),

  suggestPlacements: publicProcedure
    .input(suggestPlacementsInputSchema)
    .query(({ input: _input }) => {
      return apiOk({ suggestions: suggestPlacementsStub() });
    }),
});
