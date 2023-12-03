import {
  SpaceTransaction,
  TransactionType,
  MemberTransactionDeposit,
  Balance,
  Prisma,
  MemberTransactionWithdrawal,
  MemberTransaction,
} from "@prisma/client";
import prisma from "../db";

/**
 * Transaction with those types will not affect Member's balance
 */
const BALANCE_SKIP_DEPOSIT_TYPES = [MemberTransactionDeposit.DONATE];

/**
 * Represents a generic transaction object.
 */
export type CreateGeneric = {
  type: TransactionType;
  amount: Prisma.Decimal;
  subjectId: string;
  comment?: string;
  actorId?: string;
};

/**
 * Represents a deposit transaction object.
 */
export type CreateDeposit = CreateGeneric & {
  type: "DEPOSIT";
  source: MemberTransactionDeposit;
};

/**
 * Represents a withdrawal transaction object.
 */
export type CreateWithdrawal = CreateGeneric & {
  type: "WITHDRAWAL";
  target: MemberTransactionWithdrawal;
};

/**
 * Represents a transaction input object.
 */
export type CreateInput = CreateDeposit | CreateWithdrawal;

/**
 * Represents options for finding member transactions.
 */
export type FindAllOptions = {
  sortDate?: "desc" | "asc";
  pagination?: {
    pageSize: number;
    pageNumber: number;
  };
};

/**
 * Finds Member transactions based on the provided criteria.
 * @param where The criteria to filter member transactions.
 * @param options The options for sorting and pagination.
 * @returns A promise that resolves to an array of member transactions.
 */
export async function findMemberTransactions(
  where?: Prisma.MemberTransactionWhereInput,
  options?: FindAllOptions,
): Promise<MemberTransaction[]> {
  if (options?.pagination) {
    return prisma.memberTransaction.findMany({
      where: where,
      take: options.pagination.pageSize,
      skip: options.pagination.pageNumber * options.pagination.pageSize,
      orderBy: {
        date: options?.sortDate || "desc",
      },
    });
  }
  return prisma.memberTransaction.findMany({ where });
}

/**
 * Creates a Member transaction.
 * @param input The transaction details.
 * @returns A promise that resolves to the created Member transaction.
 */
export async function create(input: CreateInput): Promise<MemberTransaction> {
  const transaction = await prisma.memberTransaction.create({ data: input });
  await prisma.balance.upsert({
    where: {
      entityId: input.subjectId,
    },
    create: {
      entityId: input.subjectId,
      amount: input.type === "DEPOSIT" ? input.amount : input.amount.negated(),
    },
    update: {
      amount:
        input.type === "DEPOSIT"
          ? { increment: input.amount }
          : { decrement: input.amount },
    },
  });
  return transaction;
}

/**
 * Retrieves the current Member balance.
 * @returns A promise that resolves to the current member balance in cents.
 */
export async function getBalance(memberId: string): Promise<Prisma.Decimal> {
  const { amount } = (await prisma.balance.findFirst({
    where: {
      entityId: memberId,
    },
  })) as Balance;
  return amount;
}

/**
 * Recalculates the balances of all Members based on their transactions.
 */
export async function recalculateBalances(): Promise<void> {
  const transactions = await prisma.memberTransaction.findMany({
    where: {
      OR: [
        { type: "WITHDRAWAL" },
        {
          AND: [
            { type: "DEPOSIT" },
            { source: { notIn: BALANCE_SKIP_DEPOSIT_TYPES } },
          ],
        },
      ],
    },
    orderBy: {
      date: "asc",
    },
    select: {
      type: true,
      amount: true,
      subjectId: true,
    },
  });

  const balances = new Map<string, Prisma.Decimal>();
  for (const transaction of transactions) {
    const amount =
      transaction.type === "DEPOSIT"
        ? transaction.amount
        : transaction.amount.negated();

    const current = balances.get(transaction.subjectId);
    balances.set(transaction.subjectId, current ? current.add(amount) : amount);
  }

  // It's more efficient to delete all involed balances and re-create them
  return prisma.$transaction(async (tx) => {
    await tx.balance.deleteMany({
      where: {
        entityId: { in: Array.from(balances.keys()) },
      },
    });

    await tx.balance.createMany({
      data: Array.from(balances.entries()).map(([entityId, amount]) => ({
        entityId,
        amount,
      })),
    });
  });
}
