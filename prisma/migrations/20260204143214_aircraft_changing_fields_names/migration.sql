/*
  Warnings:

  - You are about to drop the column `model_full_name` on the `Aircraft` table. All the data in the column will be lost.
  - You are about to drop the column `model_icao_name` on the `Aircraft` table. All the data in the column will be lost.
  - Added the required column `modelFullName` to the `Aircraft` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelIcaoName` to the `Aircraft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aircraft" DROP COLUMN "model_full_name",
DROP COLUMN "model_icao_name",
ADD COLUMN     "modelFullName" TEXT NOT NULL,
ADD COLUMN     "modelIcaoName" TEXT NOT NULL,
ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "ExamMultiChoiceOption" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "ExamQuestion" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "ExamQuestionTheme" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "ExamTemplate" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "ExamTemplateQuestion" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "Flight" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;
