/*
  Warnings:

  - The values [ground_schrool] on the enum `FlightType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FlightType_new" AS ENUM ('flight', 'ground_school');
ALTER TABLE "public"."Flight" ALTER COLUMN "flightType" DROP DEFAULT;
ALTER TABLE "Flight" ALTER COLUMN "flightType" TYPE "FlightType_new" USING ("flightType"::text::"FlightType_new");
ALTER TYPE "FlightType" RENAME TO "FlightType_old";
ALTER TYPE "FlightType_new" RENAME TO "FlightType";
DROP TYPE "public"."FlightType_old";
ALTER TABLE "Flight" ALTER COLUMN "flightType" SET DEFAULT 'flight';
COMMIT;

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
ALTER TABLE "Instructor" ALTER COLUMN "fieldUpdates" SET DEFAULT '{}'::jsonb;
