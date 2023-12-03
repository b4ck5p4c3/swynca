import prisma from "../db";

export async function removeSubscription(
  subscriptionId: string,
): Promise<void> {
  await prisma.membershipSubscription.update({
    where: {
      id: subscriptionId,
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
