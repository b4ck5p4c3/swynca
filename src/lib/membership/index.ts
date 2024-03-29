import { Membership, Prisma, PrismaClient } from "@prisma/client";
import prisma from "../db";

/**
 * Retrieves the membership subscription history for a given member.
 * @param memberId - The ID of the member to retrieve the history for.
 * @returns Array of membership subscription including their associated membership.
 */
export async function getMemberHistory(memberId: string) {
  return prisma.membershipSubscription.findMany({
    where: {
      memberId,
    },
    include: {
      membership: true,
    },
    orderBy: {
      declinedAt: "desc",
    },
  });
}

export async function getAll(): Promise<Membership[]> {
  return prisma.membership.findMany({
    orderBy: {
      active: "desc",
    },
  });
}

export async function exists(id: string): Promise<boolean> {
  return (
    (await prisma.membership.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
      },
    })) != null
  );
}

export async function create({
  title,
  amount,
}: {
  title: string;
  amount: Prisma.Decimal;
}): Promise<void> {
  await prisma.membership.create({
    data: {
      title,
      amount,
      active: true,
    },
  });
}

export async function update(
  id: string,
  {
    title,
    amount,
    active,
  }: {
    title?: string;
    amount?: Prisma.Decimal;
    active?: boolean;
  },
): Promise<void> {
  await prisma.membership.update({
    where: {
      id,
    },
    data: {
      title,
      amount,
      active,
    },
  });
}
