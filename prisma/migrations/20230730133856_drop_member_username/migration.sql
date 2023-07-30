/*
  Warnings:

  - You are about to drop the column `username` on the `Member` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Member_username_key";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "username";
