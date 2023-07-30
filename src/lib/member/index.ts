import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function fetch(id: string) {
  return prisma.member.findFirst({
    where: {
      id,
    },
    include: {
      MembershipSubscriptionHistory: {
        include: {
          membership: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        where: {
          declinedAt: null,
        },
      },
      ACSKey: true,
    },
  });
}

export async function exists(id: string): Promise<boolean> {
  return (
    (await prisma.member.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
      },
    })) != null
  );
}
