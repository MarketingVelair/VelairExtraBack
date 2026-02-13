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
ALTER TABLE "Flight" ADD COLUMN     "canceledById" TEXT,
ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb,
ALTER COLUMN "userId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_canceledById_fkey" FOREIGN KEY ("canceledById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
