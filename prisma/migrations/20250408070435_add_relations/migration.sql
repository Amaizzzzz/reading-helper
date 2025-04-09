/*
  Warnings:

  - Added the required column `directTranslation` to the `Flashcard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "correctStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "difficulty" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "directTranslation" TEXT,
ADD COLUMN     "lastReviewed" TIMESTAMP(3),
ADD COLUMN     "masteryLevel" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nextReview" TIMESTAMP(3),
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "translation" JSONB;

-- Update existing records
UPDATE "Flashcard" SET "directTranslation" = "word" WHERE "directTranslation" IS NULL;

-- Make directTranslation required
ALTER TABLE "Flashcard" ALTER COLUMN "directTranslation" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Flashcard_userId_idx" ON "Flashcard"("userId");

-- CreateIndex
CREATE INDEX "Flashcard_status_idx" ON "Flashcard"("status");

-- CreateIndex
CREATE INDEX "Flashcard_nextReview_idx" ON "Flashcard"("nextReview");
