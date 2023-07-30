import { PrismaClient, KeyType } from "@prisma/client";

const prisma = new PrismaClient();

export async function addKey(
  memberId: string,
  type: KeyType,
  key: string
): Promise<void> {
  await prisma.aCSKey.create({
    data: {
      memberId,
      type,
      key,
    },
  });
}

export async function deleteKey(id: string) {
  return prisma.aCSKey.delete({
    where: {
      id,
    },
  });
}
