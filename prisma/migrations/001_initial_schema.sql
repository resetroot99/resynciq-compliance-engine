-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'ESTIMATOR', 'AUDITOR');
CREATE TYPE "CompanyType" AS ENUM ('BODY_SHOP', 'INSURANCE', 'FLEET', 'INDEPENDENT');
CREATE TYPE "EstimateStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE "Severity" AS ENUM ('INFO', 'WARNING', 'ERROR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auth0Id" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ESTIMATOR',
    "companyId" TEXT,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("companyId") REFERENCES "Company"("id")
);

-- CreateTable Company
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" "CompanyType" NOT NULL,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'FREE',
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable Estimate
CREATE TABLE "Estimate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" "EstimateStatus" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "aiAnalysis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id"),
    FOREIGN KEY ("companyId") REFERENCES "Company"("id")
);

-- CreateTable VehicleInfo
CREATE TABLE "VehicleInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "vin" TEXT NOT NULL,
    "estimateId" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id")
);

-- CreateTable ComplianceCheck
CREATE TABLE "ComplianceCheck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "score" DOUBLE PRECISION NOT NULL,
    "issues" JSONB,
    "estimateId" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id")
);

-- CreateTable ComplianceRule
CREATE TABLE "ComplianceRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "parameters" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndexes
CREATE INDEX "estimate_user_id_idx" ON "Estimate"("userId");
CREATE INDEX "estimate_company_id_idx" ON "Estimate"("companyId");
CREATE INDEX "estimate_status_idx" ON "Estimate"("status");
CREATE INDEX "compliance_rule_category_idx" ON "ComplianceRule"("category");

-- Additional tables... 