import { getMemberKeys } from "@/lib/acs";
import { KeyType } from "@prisma/client";

export type KeyDTO = {
  createdAt: string;
  id: string;
  key: string;
  memberId: string;
  name: string;
  type: KeyType;
  updatedAt: string;
};

export type FetchMemberKeysDTO = KeyDTO[];

/**
 * Mask sensitive key information
 * @param type Key type
 * @param key Key value
 * @returns Masked key
 */
const mask = (type: KeyType, key: string): string => {
  // For PAN, follow PCI DSS rule of masking all but last 4 digits
  if (type === "PAN") {
    return "*".repeat(key.length - 4) + key.slice(-4);
  }

  // For UID, mask everything but last 2 characters
  if (type === "UID") {
    return "*".repeat(key.length - 2) + key.slice(-2);
  }

  // Fallback to full reveal
  return key;
};

export async function fetchMemberKeys(
  memberId: string
): Promise<FetchMemberKeysDTO> {
  const keys = await getMemberKeys(memberId);
  return keys.map((key) => ({
    createdAt: key.createdAt.toISOString(),
    id: key.id,
    key: mask(key.type, key.key),
    memberId: key.memberId,
    name: key.name,
    type: key.type,
    updatedAt: key.updatedAt.toISOString(),
  }));
}
