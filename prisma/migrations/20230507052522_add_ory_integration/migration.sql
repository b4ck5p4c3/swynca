-- CreateTable
CREATE TABLE "ExternalAuthenticationOry" (
    "oryId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "ExternalAuthenticationOry_pkey" PRIMARY KEY ("oryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalAuthenticationOry_oryId_key" ON "ExternalAuthenticationOry"("oryId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalAuthenticationOry_memberId_key" ON "ExternalAuthenticationOry"("memberId");

-- AddForeignKey
ALTER TABLE "ExternalAuthenticationOry" ADD CONSTRAINT "ExternalAuthenticationOry_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
