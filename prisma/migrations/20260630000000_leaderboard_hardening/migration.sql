-- Leaderboard indexes, corpus version on snapshots, Postgres rate-limit buckets

ALTER TABLE "ScoreSnapshot" ADD COLUMN "corpusPresetVersion" INTEGER NOT NULL DEFAULT 1;

CREATE INDEX "ScoreSnapshot_corpusPresetId_totalScore_idx"
  ON "ScoreSnapshot"("corpusPresetId", "totalScore" DESC);

CREATE TABLE "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "RateLimitBucket_resetAt_idx" ON "RateLimitBucket"("resetAt");
