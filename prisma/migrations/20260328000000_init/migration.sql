-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "KeyboardTemplate" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "geometryRef" JSONB NOT NULL,
    "fingerMapRef" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isCommunity" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KeyboardTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LayoutRecord" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "kleSerialized" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "alias" TEXT,
    "source" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LayoutRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorpusPreset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ngramArtifactRef" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CorpusPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreSnapshot" (
    "id" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,
    "corpusPresetId" TEXT NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "breakdown" JSONB NOT NULL,
    "scorerVersion" TEXT NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoreSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionRecord" (
    "id" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "promotedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KeyboardTemplate_slug_key" ON "KeyboardTemplate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LayoutRecord_fingerprint_key" ON "LayoutRecord"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionRecord_layoutId_key" ON "PromotionRecord"("layoutId");

-- AddForeignKey
ALTER TABLE "LayoutRecord" ADD CONSTRAINT "LayoutRecord_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "KeyboardTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreSnapshot" ADD CONSTRAINT "ScoreSnapshot_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "LayoutRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreSnapshot" ADD CONSTRAINT "ScoreSnapshot_corpusPresetId_fkey" FOREIGN KEY ("corpusPresetId") REFERENCES "CorpusPreset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionRecord" ADD CONSTRAINT "PromotionRecord_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "LayoutRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
