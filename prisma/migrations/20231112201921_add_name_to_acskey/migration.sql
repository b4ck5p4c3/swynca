/*
  Warnings:

  - Added the required column `name` to the `ACSKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ACSKey" ADD COLUMN     "name" TEXT NOT NULL;
