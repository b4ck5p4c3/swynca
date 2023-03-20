-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "SpaceTransactionDeposit" AS ENUM ('MAGIC', 'DONATE', 'MEMBERSHIP');

-- CreateEnum
CREATE TYPE "SpaceTransactionWithdrawal" AS ENUM ('MAGIC', 'BASIC', 'PURCHASES');

-- CreateTable
CREATE TABLE "SpaceTransaction" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "comment" TEXT,
    "actorId" TEXT,
    "source" "SpaceTransactionDeposit",
    "target" "SpaceTransactionWithdrawal",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "SpaceTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpaceTransaction" ADD CONSTRAINT "SpaceTransaction_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
