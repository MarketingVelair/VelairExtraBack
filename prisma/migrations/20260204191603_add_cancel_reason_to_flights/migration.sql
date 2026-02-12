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
ALTER TABLE "Flight" ADD COLUMN     "cancelReason" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;

-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;
