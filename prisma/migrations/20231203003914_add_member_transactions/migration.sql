-- CreateEnum
CREATE TYPE "MemberTransactionDeposit" AS ENUM ('MAGIC', 'DONATE', 'TOPUP');

-- CreateEnum
CREATE TYPE "MemberTransactionWithdrawal" AS ENUM ('MAGIC', 'MEMBERSHIP');

-- CreateTable
CREATE TABLE "MemberTransaction" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "comment" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subjectId" TEXT NOT NULL,
    "actorId" TEXT,
    "source" "MemberTransactionDeposit",
    "target" "MemberTransactionWithdrawal",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "MemberTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemberTransaction" ADD CONSTRAINT "MemberTransaction_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberTransaction" ADD CONSTRAINT "MemberTransaction_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
