import {
  findMany,
  getBalance,
  getBasicExpenses,
  getTransactionsCount,
} from "@/lib/space-transaction";
import { TransactionType } from "@prisma/client";

export type CurrentSpaceBalanceDTO = {
  amount: number;
  basicExpenses: number;
  difference: number;
};

export type SpaceTransactionDTO = {
  id: string;
  type: TransactionType;
  amount: number;
  comment: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  actor?: {
    id: string;
    name: string;
  };
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

export async function fetchSpaceTransactionsCount(): Promise<number> {
  // @todo caching
  return getTransactionsCount();
}

export async function fetchSpaceTransactions(pagination?: {
  pageNumber: number;
  pageSize: number;
}): Promise<SpaceTransactionDTO[]> {
  const txs = await findMany(undefined, {
    pagination,
  });

  return txs.map((tx) => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount.toNumber(),
    comment: tx.comment,
    date: tx.date.toISOString(),
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
    actor: tx.Actor
      ? {
          id: tx.Actor.id,
          name: tx.Actor.name,
        }
      : undefined,
  }));
}
