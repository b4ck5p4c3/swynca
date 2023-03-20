-- CreateEnum
CREATE TYPE "MemberStatuses" AS ENUM ('ACTIVE', 'FROZEN');

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "MemberStatuses" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalAuthenticationAuth0" (
    "auth0Id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "ExternalAuthenticationAuth0_pkey" PRIMARY KEY ("auth0Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalAuthenticationAuth0_auth0Id_key" ON "ExternalAuthenticationAuth0"("auth0Id");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalAuthenticationAuth0_memberId_key" ON "ExternalAuthenticationAuth0"("memberId");

-- AddForeignKey
ALTER TABLE "ExternalAuthenticationAuth0" ADD CONSTRAINT "ExternalAuthenticationAuth0_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
