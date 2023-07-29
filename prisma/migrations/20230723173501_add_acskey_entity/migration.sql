-- CreateTable
CREATE TABLE "ACSKey" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" "KeyType" NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "ACSKey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ACSKey" ADD CONSTRAINT "ACSKey_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
