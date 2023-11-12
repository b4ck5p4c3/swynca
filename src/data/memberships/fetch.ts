import { getAll } from "@/lib/membership";

export type MembershipDTO = {
  id: string;
  title: string;
  amount: number;
  active: boolean;
};

export type FetchAllMembershipDTO = MembershipDTO[];

/**
 * Fetches all memberships
 * @returns All memberships available in the system.
 */
export async function fetchAll(): Promise<FetchAllMembershipDTO> {
  const memberships = await getAll();
  return memberships.map((membership) => ({
    id: membership.id,
    title: membership.title,
    amount: Number(membership.amount.toFixed(2)),
    active: membership.active,
  }));
}
