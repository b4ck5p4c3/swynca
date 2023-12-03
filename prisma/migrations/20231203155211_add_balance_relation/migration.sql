/*
  Warnings:

  - The primary key for the `Balance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Balance` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- Delete existing balances
DELETE FROM "Balance";

-- AlterTable
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "entityId" DROP NOT NULL,
ADD CONSTRAINT "Balance_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Insert default entry for space balance
INSERT INTO "Balance" ("id", "entityId", "amount") VALUES ('00000000-0000-0000-0000-000000000000', NULL, 0);