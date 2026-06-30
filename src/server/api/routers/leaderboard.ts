import { Prisma } from "../../../../generated/prisma";
import { z } from "zod";

import { getCompletenessScore } from "@/lib/layout/analysis";
import { serializeKle } from "@/lib/layout";
import { computeLayoutFingerprint } from "@/lib/leaderboard/fingerprint";
import { withCorpusPresetLock } from "@/lib/leaderboard/preset-lock";
import { computeCompetitionRanks } from "@/lib/leaderboard/rank";
import { resolveKeyboardTemplateSlug } from "@/lib/leaderboard/template-slug";
import { evaluateSubmitEligibility } from "@/lib/leaderboard/submit-rules";
import type {
  CommunityTemplate,
  LeaderboardEntry,
  LeaderboardStatus,
} from "@/lib/leaderboard/types";
import { DEFAULT_SCORING_CONFIG } from "@/lib/scoring";

import { apiFail, apiOk } from "~/server/api/result";
import { layoutInputSchema } from "~/server/api/schemas/layout";
import { aliasSchema, corpusPresetIdSchema } from "~/server/api/schemas/shared";
import {
  evaluateLayoutScore,
  resolveNgramStats,
} from "~/server/api/services/scoring";
import {
  createTRPCRouter,
  leaderboardSubmitProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const listInputSchema = z.object({
  corpusPresetId: corpusPresetIdSchema,
  limit: z.number().int().min(1).max(50).default(20),
  /** Offset-based cursor (stringified non-negative integer). */
  cursor: z
    .string()
    .regex(/^\d+$/, "Cursor must be a non-negative integer offset")
    .optional(),
});

const statusInputSchema = z.object({
  corpusPresetId: corpusPresetIdSchema,
});

const submitInputSchema = z.object({
  layout: layoutInputSchema,
  corpusPresetId: corpusPresetIdSchema,
  alias: aliasSchema,
});

function parseOffsetCursor(cursor: string | undefined): number {
  if (cursor === undefined) {
    return 0;
  }

  return Number.parseInt(cursor, 10);
}

export const leaderboardRouter = createTRPCRouter({
  list: publicProcedure.input(listInputSchema).query(async ({ ctx, input }) => {
    const offset = parseOffsetCursor(input.cursor);

    const total = await ctx.db.scoreSnapshot.count({
      where: { corpusPresetId: input.corpusPresetId },
    });

    const rows = await ctx.db.scoreSnapshot.findMany({
      where: { corpusPresetId: input.corpusPresetId },
      orderBy: [{ totalScore: "desc" }, { id: "desc" }],
      skip: offset,
      take: input.limit + 1,
      include: {
        layout: {
          select: {
            alias: true,
            createdAt: true,
          },
        },
      },
    });

    const hasMore = rows.length > input.limit;
    const pageRows = hasMore ? rows.slice(0, input.limit) : rows;

    const rankByScore = await computeCompetitionRanks(
      ctx.db,
      input.corpusPresetId,
      pageRows.map((row) => row.totalScore),
    );

    const entries: LeaderboardEntry[] = pageRows.map((row) => ({
      id: row.id,
      rank: rankByScore.get(row.totalScore) ?? 1,
      alias: row.layout.alias,
      totalScore: row.totalScore,
      corpusPresetId: row.corpusPresetId,
      submittedAt: row.layout.createdAt,
    }));

    const nextCursor = hasMore ? String(offset + input.limit) : null;

    return apiOk(entries, {
      limit: input.limit,
      cursor: nextCursor,
      total,
    });
  }),

  status: publicProcedure
    .input(statusInputSchema)
    .query(async ({ ctx, input }) => {
      const [currentBest, totalEntries] = await Promise.all([
        ctx.db.scoreSnapshot.findFirst({
          where: { corpusPresetId: input.corpusPresetId },
          orderBy: { totalScore: "desc" },
          include: {
            layout: {
              select: { alias: true },
            },
          },
        }),
        ctx.db.scoreSnapshot.count({
          where: { corpusPresetId: input.corpusPresetId },
        }),
      ]);

      const status: LeaderboardStatus = {
        currentBestScore: currentBest?.totalScore ?? null,
        currentBestAlias: currentBest?.layout.alias ?? null,
        totalEntries,
      };

      return apiOk(status);
    }),

  submit: leaderboardSubmitProcedure
    .input(submitInputSchema)
    .mutation(async ({ ctx, input }) => {
      const fingerprint = computeLayoutFingerprint(input.layout);
      const templateSlug = resolveKeyboardTemplateSlug(input.layout.templateId);

      let score: ReturnType<typeof evaluateLayoutScore>;
      try {
        const ngramStats = await resolveNgramStats(input.corpusPresetId);
        score = evaluateLayoutScore(input.layout, ngramStats);
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "Leaderboard submit failed";
        return apiFail(message);
      }

      const completenessScore = getCompletenessScore(input.layout);

      try {
        const transactionResult = await ctx.db.$transaction(async (tx) =>
          withCorpusPresetLock(tx, input.corpusPresetId, async () => {
            const existingLayout = await tx.layoutRecord.findUnique({
              where: { fingerprint },
            });

            if (existingLayout) {
              const existingSnapshot = await tx.scoreSnapshot.findFirst({
                where: {
                  layoutId: existingLayout.id,
                  corpusPresetId: input.corpusPresetId,
                },
              });

              if (existingSnapshot) {
                return { kind: "duplicate" as const };
              }
            }

            const template = await tx.keyboardTemplate.findFirst({
              where: { slug: templateSlug },
            });

            if (!template) {
              return {
                kind: "unknown_template" as const,
                slug: templateSlug,
              };
            }

            const corpusPreset = await tx.corpusPreset.findUnique({
              where: { id: input.corpusPresetId },
            });

            if (!corpusPreset) {
              return { kind: "unknown_preset" as const };
            }

            const currentBest = await tx.scoreSnapshot.findFirst({
              where: { corpusPresetId: input.corpusPresetId },
              orderBy: { totalScore: "desc" },
            });

            const decision = evaluateSubmitEligibility(
              score.total,
              currentBest?.totalScore ?? null,
              completenessScore,
            );

            if (!decision.accepted) {
              return {
                kind: "rejected" as const,
                decision,
                totalScore: score.total,
                currentBestScore: currentBest?.totalScore ?? null,
              };
            }

            const layoutRecord =
              existingLayout ??
              (await tx.layoutRecord.create({
                data: {
                  templateId: template.id,
                  kleSerialized: serializeKle(input.layout),
                  fingerprint,
                  alias: input.alias ?? null,
                  source: "user",
                },
              }));

            const snapshot = await tx.scoreSnapshot.create({
              data: {
                layoutId: layoutRecord.id,
                corpusPresetId: input.corpusPresetId,
                totalScore: score.total,
                breakdown: score.breakdown,
                scorerVersion: DEFAULT_SCORING_CONFIG.scorerVersion,
                corpusPresetVersion: corpusPreset.version,
              },
            });

            const rank =
              (await tx.scoreSnapshot.count({
                where: {
                  corpusPresetId: input.corpusPresetId,
                  totalScore: { gt: snapshot.totalScore },
                },
              })) + 1;

            return {
              kind: "accepted" as const,
              decision,
              layoutRecord,
              snapshot,
              rank,
            };
          }),
        );

        if (transactionResult.kind === "duplicate") {
          const currentBest = await ctx.db.scoreSnapshot.findFirst({
            where: { corpusPresetId: input.corpusPresetId },
            orderBy: { totalScore: "desc" },
          });

          return apiOk({
            accepted: false as const,
            reason: "duplicate" as const,
            rank: null,
            totalScore: score.total,
            currentBestScore: currentBest?.totalScore ?? null,
          });
        }

        if (transactionResult.kind === "unknown_template") {
          return apiFail(
            `Unknown keyboard template: ${transactionResult.slug}`,
          );
        }

        if (transactionResult.kind === "unknown_preset") {
          return apiFail(`Unknown corpus preset: ${input.corpusPresetId}`);
        }

        if (transactionResult.kind === "rejected") {
          return apiOk({
            accepted: false as const,
            reason: transactionResult.decision.reason,
            rank: null,
            totalScore: transactionResult.totalScore,
            currentBestScore: transactionResult.currentBestScore,
          });
        }

        return apiOk({
          accepted: true as const,
          reason: transactionResult.decision.reason,
          rank: transactionResult.rank,
          totalScore: transactionResult.snapshot.totalScore,
          layoutId: transactionResult.layoutRecord.id,
          scoreSnapshotId: transactionResult.snapshot.id,
        });
      } catch (cause) {
        if (
          cause instanceof Prisma.PrismaClientKnownRequestError &&
          cause.code === "P2002"
        ) {
          const currentBest = await ctx.db.scoreSnapshot.findFirst({
            where: { corpusPresetId: input.corpusPresetId },
            orderBy: { totalScore: "desc" },
          });

          return apiOk({
            accepted: false as const,
            reason: "duplicate" as const,
            rank: null,
            totalScore: score.total,
            currentBestScore: currentBest?.totalScore ?? null,
          });
        }

        const message =
          cause instanceof Error ? cause.message : "Leaderboard submit failed";
        return apiFail(message);
      }
    }),

  templates: publicProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.keyboardTemplate.findMany({
      where: { isCommunity: true },
      include: {
        layouts: {
          where: { promotion: { isNot: null } },
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { promotion: true },
        },
      },
    });

    const communityTemplates: CommunityTemplate[] = templates.flatMap(
      (template) =>
        template.layouts.flatMap((layout) => {
          if (!layout.promotion) {
            return [];
          }
          return [
            {
              id: template.id,
              slug: template.slug,
              name: template.name,
              kleSerialized: layout.kleSerialized,
              promotedAt: layout.promotion.promotedAt,
            },
          ];
        }),
    );

    return apiOk(communityTemplates);
  }),
});
