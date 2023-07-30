/*
  Warnings:

  - A unique constraint covering the columns `[memberId,membershipId]` on the table `MembershipSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MembershipSubscription_memberId_membershipId_key" ON "MembershipSubscription"("memberId", "membershipId");
