import {
  PrismaClient,
  SpaceTransaction,
  TransactionType,
  SpaceTransactionDeposit,
  SpaceTransactionWithdrawal,
} from "@prisma/client";

const prisma = new PrismaClient();

/**
 * UUID for Space balance in Balances table
 */
const BALANCES_SPACE_UUID = "00000000-0000-0000-0000-000000000000";

export type CreateGeneric = {
  type: TransactionType;
  amount: number;
  comment?: string;
  actorId?: string;
};

export type CreateDeposit = CreateGeneric & {
  type: "DEPOSIT";
  source: SpaceTransactionDeposit;
};

export type CreateWithdrawal = CreateGeneric & {
  type: "WITHDRAWAL";
  sourcew: SpaceTransactionWithdrawal;
};

export type CreateInput = CreateDeposit | CreateWithdrawal;

export async function create(input: CreateInput): Promise<SpaceTransaction> {
  const transaction = await prisma.spaceTransaction.create({ data: input });

  // Perform atomic increment/decrement over space balance
  prisma.balance.update({
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
