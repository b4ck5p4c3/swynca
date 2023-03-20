-- CreateTable
CREATE TABLE "Balance" (
    "entityId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("entityId")
);

-- Insert default space balance
INSERT INTO "Balance" VALUES('00000000-0000-0000-0000-000000000000', 0);

-- CreateIndex
CREATE UNIQUE INDEX "Balance_entityId_key" ON "Balance"("entityId");
