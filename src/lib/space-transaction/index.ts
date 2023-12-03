import {
  PrismaClient,
  SpaceTransaction,
  TransactionType,
  SpaceTransactionDeposit,
  SpaceTransactionWithdrawal,
  Balance,
  Prisma,
} from "@prisma/client";
import prisma from "../db";

/**
 * UUID for Space balance in Balances table
 */
const BALANCES_SPACE_UUID = "00000000-0000-0000-0000-000000000000";

export type CreateGeneric = {
  type: TransactionType;
  amount: Prisma.Decimal;
  comment?: string;
  actorId?: string;
};

export type CreateDeposit = CreateGeneric & {
  type: "DEPOSIT";
  source: SpaceTransactionDeposit;
};

export type CreateWithdrawal = CreateGeneric & {
  type: "WITHDRAWAL";
  target: SpaceTransactionWithdrawal;
};

export type CreateInput = CreateDeposit | CreateWithdrawal;

export type FindAllOptions = {
  sortDate?: "desc" | "asc";
  pagination?: {
    pageSize: number;
    pageNumber: number;
  };
};

/**
 * Returns all space transactions ordered
 * @param options
 * @returns
 */
export async function findAll(
  where?: Prisma.SpaceTransactionWhereInput,
  options?: FindAllOptions,
): Promise<SpaceTransaction[]> {
  if (options?.pagination) {
    return prisma.spaceTransaction.findMany({
      where: where,
      take: options.pagination.pageSize,
      skip: options.pagination.pageNumber * options.pagination.pageSize,
      orderBy: {
        date: options?.sortDate || "desc",
      },
    });
  }
  return prisma.spaceTransaction.findMany({ where });
}

/**
 * Create space transaction
 * @param input Transaction details
 * @returns Created transactions properties
 */
export async function create(input: CreateInput): Promise<SpaceTransaction> {
  const transaction = await prisma.spaceTransaction.create({ data: input });
  await prisma.balance.update({
    where: {
      entityId: BALANCES_SPACE_UUID,
    },
    data: {
      amount:
        input.type === "DEPOSIT"
          ? { increment: input.amount }
          : { decrement: input.amount },
    },
  });
  return transaction;
}

/**
 * Current space balance
 * @returns Current space balance in cents
 */
export async function getBalance(): Promise<Prisma.Decimal> {
  const { amount } = (await prisma.balance.findFirst({
    where: {
      entityId: BALANCES_SPACE_UUID,
    },
  })) as Balance;
  return amount;
}

/**
 * Recalculates the balance by summing up the amounts of all space transactions
 */
export async function recalculateBalance(): Promise<void> {
  const transactions = await prisma.spaceTransaction.findMany({
    select: {
      type: true,
      amount: true,
    },
  });

  const balance = transactions.reduce(
    (acc, transaction) =>
      transaction.type === "DEPOSIT"
        ? acc.add(transaction.amount)
        : acc.sub(transaction.amount),
    new Prisma.Decimal(0),
  );

  await prisma.balance.update({
    where: {
      entityId: BALANCES_SPACE_UUID,
    },
    data: {
      amount: balance,
    },
  });
}

/**
 * Returns space basic expenses
 * @returns Space basic expenses in cents
 */
export async function getBasicExpenses(): Promise<Prisma.Decimal> {
  // @todo: replace hard-coded value with configurable (in DB) one
  return new Prisma.Decimal(65 * 1000);
}
