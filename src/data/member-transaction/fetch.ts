import { getBalancesFlow } from "@/lib/member-finance";

export type MemberBalanceTableEntry = {
  id: string;
  name: string;
  currentBalance: number;
  monthlyExpenses: number;
};

export type MemberBalanceTableDTO = MemberBalanceTableEntry[];

/**
 * Fetches the member balance table.
 * @returns Information about the current balance and monthly expenses for each member.
 */
export async function fetchMemberBalanceTable(): Promise<MemberBalanceTableDTO> {
  const flows = await getBalancesFlow();
  return flows.map((flow) => ({
    id: flow.member.id,
    name: flow.member.name,
    currentBalance: flow.balance.toNumber(),
    monthlyExpenses: flow.monthlyExpenses.toNumber(),
  }));
}
