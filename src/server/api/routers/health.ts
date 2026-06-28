import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const healthRouter = createTRPCRouter({
  ping: publicProcedure
    .input(z.object({ echo: z.string().optional() }).optional())
    .query(({ input }) => ({
      ok: true as const,
      app: "pkbl" as const,
      echo: input?.echo ?? null,
    })),
});
