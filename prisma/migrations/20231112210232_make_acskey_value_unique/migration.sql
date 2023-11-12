/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `ACSKey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ACSKey_key_key" ON "ACSKey"("key");
