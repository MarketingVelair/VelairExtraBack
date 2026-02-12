/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Instructor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'INSTRUCTOR';

-- AlterTable
ALTER TABLE "Aircraft" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

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
ALTER TABLE "Instructor" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_userId_key" ON "Instructor"("userId");

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
