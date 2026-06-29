import type { Prisma, PrismaClient } from "../../../generated/prisma";

type RankDb = Prisma.TransactionClient | PrismaClient;

/** Competition ranking: tied scores share the same rank (1, 1, 3 …). */
export async function computeCompetitionRanks(
  db: RankDb,
  corpusPresetId: string,
  scores: readonly number[],
): Promise<Map<number, number>> {
  const uniqueScores = [...new Set(scores)];
  const rankByScore = new Map<number, number>();

  await Promise.all(
    uniqueScores.map(async (score) => {
      const higherCount = await db.scoreSnapshot.count({
        where: {
          corpusPresetId,
          totalScore: { gt: score },
        },
      });
      rankByScore.set(score, higherCount + 1);
    }),
  );

  return rankByScore;
}
