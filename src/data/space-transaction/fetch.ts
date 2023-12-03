import { getBalance, getBasicExpenses } from "@/lib/space-transaction";

export type CurrentSpaceBalanceDTO = {
  amount: number;
  basicExpenses: number;
  difference: number;
};

export async function fetchCurrentSpaceBalance(): Promise<CurrentSpaceBalanceDTO> {
  const basicExpenses = await getBasicExpenses();
  const balance = await getBalance();
  return {
    amount: balance.toNumber(),
    basicExpenses: basicExpenses.toNumber(),
    difference: balance.sub(basicExpenses).toNumber(),
  };
}
