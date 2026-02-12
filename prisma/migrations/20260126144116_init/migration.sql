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
