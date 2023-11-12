import { Prisma, PrismaClient } from "@prisma/client";
import { exists } from "@/lib/member";
import { undefined } from "zod";

const prisma = new PrismaClient();

export async function unsubscribe(
  memberId: string,
  membershipId: string,
): Promise<void> {
  await prisma.membershipSubscription.updateMany({
    where: {
      memberId,
      membershipId,
      declinedAt: null,
    },
    data: {
      declinedAt: new Date(),
    },
  });
}

export async function activeExists(
  memberId: string,
  membershipId: string,
): Promise<boolean> {
  return (
    (await prisma.membershipSubscription.findFirst({
      where: {
        memberId,
        membershipId,
        declinedAt: null,
      },
    })) != null
  );
}

export async function add(
  memberId: string,
  membershipId: string,
): Promise<void> {
  await prisma.membershipSubscription.create({
    data: {
      memberId,
      membershipId,
    },
  });
}
