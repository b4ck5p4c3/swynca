import { getMemberHistory } from "@/lib/membership";

export type GetMemberHistoryDTO = {
  id: string;
  subscribedAt: string;
  declinedAt: string | null;
  membership: {
    id: string;
    title: string;
    amount: number;
  }
}[];

/**
 * Fetches the membership subscription history for a given member.
 * @param memberId - The ID of the member to fetch the history for.
 * @returns Membership subscription history for the given member.
 */

export async function fetchMemberHistory(memberId: string): Promise<GetMemberHistoryDTO> {
  const history = await getMemberHistory(memberId);
  return history.map(entry => ({
    id: entry.id,
    subscribedAt: entry.subscribedAt.toISOString(),
    declinedAt: entry.declinedAt?.toISOString() ?? null,
    membership: {
      id: entry.membership.id,
      title: entry.membership.title,
      amount: Number(entry.membership.amount.toFixed(2)),
    }
  }));
}