-- CreateTable
CREATE TABLE "Balance" (
    "entityId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("entityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Balance_entityId_key" ON "Balance"("entityId");
