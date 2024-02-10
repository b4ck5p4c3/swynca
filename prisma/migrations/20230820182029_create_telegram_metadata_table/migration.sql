-- CreateTable
CREATE TABLE "TelegramMetadata" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "telegramName" TEXT,

    CONSTRAINT "TelegramMetadata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TelegramMetadata" ADD CONSTRAINT "TelegramMetadata_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "TelegramMetadata_id_key" ON "TelegramMetadata"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramMetadata_memberId_key" ON "TelegramMetadata"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramMetadata_telegramId_key" ON "TelegramMetadata"("telegramId");
