import { corpusRouter } from "~/server/api/routers/corpus";
import { healthRouter } from "~/server/api/routers/health";
import { layoutRouter } from "~/server/api/routers/layout";
import { leaderboardRouter } from "~/server/api/routers/leaderboard";
import { scoreRouter } from "~/server/api/routers/score";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  score: scoreRouter,
  layout: layoutRouter,
  corpus: corpusRouter,
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
