-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "employeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "basicInfo" JSONB,
    "clinicalAssessment" JSONB,
    "lifestyle" JSONB,
    "biochemical" JSONB,
    "idrs" JSONB,
    "timestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "draft_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "basicInfo" JSONB NOT NULL,
    "clinicalAssessment" JSONB NOT NULL,
    "lifestyle" JSONB NOT NULL,
    "biochemical" JSONB NOT NULL,
    "idrs" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeId_key" ON "users"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "draft_assessments_userId_key" ON "draft_assessments"("userId");

-- CreateIndex
CREATE INDEX "draft_assessments_userId_idx" ON "draft_assessments"("userId");

-- CreateIndex
CREATE INDEX "assessments_userId_idx" ON "assessments"("userId");

-- CreateIndex
CREATE INDEX "assessments_employeeId_idx" ON "assessments"("employeeId");

-- CreateIndex
CREATE INDEX "assessments_submittedAt_idx" ON "assessments"("submittedAt");

-- AddForeignKey
ALTER TABLE "draft_assessments" ADD CONSTRAINT "draft_assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
