-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ExamQuestionType" AS ENUM ('MULTI_CHOICE', 'OPEN_FIELD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tempPasswordHash" TEXT,
    "tempPasswordExpiresAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuthToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamQuestionTheme" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fieldUpdates" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExamQuestionTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamMultiChoiceOption" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fieldUpdates" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "questionId" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "index" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExamMultiChoiceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamQuestion" (
    "id" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "ExamQuestionType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "fieldUpdates" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExamQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "enableMaxTime" BOOLEAN NOT NULL DEFAULT false,
    "maxTimeSeconds" INTEGER NOT NULL,
    "fieldUpdates" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExamTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamTemplateQuestion" (
    "id" TEXT NOT NULL,
    "examTemplateId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "fieldUpdates" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExamTemplateQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthToken_tokenHash_key" ON "UserAuthToken"("tokenHash");

-- CreateIndex
CREATE INDEX "ExamQuestionTheme_updatedAt_deletedAt_idx" ON "ExamQuestionTheme"("updatedAt", "deletedAt");

-- CreateIndex
CREATE INDEX "ExamMultiChoiceOption_updatedAt_deletedAt_idx" ON "ExamMultiChoiceOption"("updatedAt", "deletedAt");

-- CreateIndex
CREATE INDEX "ExamQuestion_updatedAt_deletedAt_idx" ON "ExamQuestion"("updatedAt", "deletedAt");

-- CreateIndex
CREATE INDEX "ExamTemplate_updatedAt_deletedAt_idx" ON "ExamTemplate"("updatedAt", "deletedAt");

-- CreateIndex
CREATE INDEX "ExamTemplateQuestion_updatedAt_deletedAt_idx" ON "ExamTemplateQuestion"("updatedAt", "deletedAt");

-- AddForeignKey
ALTER TABLE "UserAuthToken" ADD CONSTRAINT "UserAuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamMultiChoiceOption" ADD CONSTRAINT "ExamMultiChoiceOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ExamQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamQuestion" ADD CONSTRAINT "ExamQuestion_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "ExamQuestionTheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamTemplateQuestion" ADD CONSTRAINT "ExamTemplateQuestion_examTemplateId_fkey" FOREIGN KEY ("examTemplateId") REFERENCES "ExamTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamTemplateQuestion" ADD CONSTRAINT "ExamTemplateQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ExamQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
