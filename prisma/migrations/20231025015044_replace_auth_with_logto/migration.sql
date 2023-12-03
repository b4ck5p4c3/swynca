/*
  Warnings:

  - You are about to drop the `ExternalAuthenticationAuth0` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExternalAuthenticationOry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExternalAuthenticationAuth0" DROP CONSTRAINT "ExternalAuthenticationAuth0_memberId_fkey";

-- DropForeignKey
ALTER TABLE "ExternalAuthenticationOry" DROP CONSTRAINT "ExternalAuthenticationOry_memberId_fkey";

-- DropTable
DROP TABLE "ExternalAuthenticationAuth0";

-- DropTable
DROP TABLE "ExternalAuthenticationOry";

-- CreateTable
CREATE TABLE "ExternalAuthenticationLogto" (
    "logtoId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "ExternalAuthenticationLogto_pkey" PRIMARY KEY ("logtoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalAuthenticationLogto_logtoId_key" ON "ExternalAuthenticationLogto"("logtoId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalAuthenticationLogto_memberId_key" ON "ExternalAuthenticationLogto"("memberId");

-- AddForeignKey
ALTER TABLE "ExternalAuthenticationLogto" ADD CONSTRAINT "ExternalAuthenticationLogto_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
