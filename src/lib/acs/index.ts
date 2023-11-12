import { PrismaClient, KeyType, ACSKey } from "@prisma/client";
import { isACSUID, isPAN } from "../validation";

const prisma = new PrismaClient();

export async function getMemberKeys(memberId: string) {
  return prisma.aCSKey.findMany({
    where: {
      memberId,
    },
  });
}

export async function deleteKey(keyId: string) {
  return prisma.aCSKey.delete({
    where: {
      id: keyId,
    },
  });
}

export async function isKeyExists(key: string) {
  const existing = await prisma.aCSKey.findFirst({
    where: {
      key,
    },
  });

  return existing !== null;
}

export async function getKeyById(id: string) {
  return prisma.aCSKey.findFirst({
    where: {
      id,
    },
  });
}

export async function createKey(key: {
  memberId: string;
  key: string;
  type: KeyType;
  name: string;
}): Promise<ACSKey> {
  // Check UID or PAN validity
  if (key.type === "UID" && !isACSUID(key.key)) {
    throw new Error("Invalid ACS UID");
  }

  if (key.type === "PAN" && !isPAN(key.key)) {
    throw new Error("Invalid PAN");
  }

  return prisma.aCSKey.create({
    data: key,
  });
}
