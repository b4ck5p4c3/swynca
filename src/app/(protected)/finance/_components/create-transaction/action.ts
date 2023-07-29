"use server";

import { getServerSession } from "@/lib/auth/wrapper";
import { create } from "@/lib/space-transactions";
import {
  SpaceTransactionDeposit,
  SpaceTransactionWithdrawal,
  TransactionType,
} from "@prisma/client";
import { revalidateTag } from "next/cache";

type CreateTransactionResult =
  | {
      success: true;
      error?: undefined;
    }
  | {
      success: false;
      error: string;
    };

const getGenericInputError = (amount: number, description: string) => {
  if (Number.isNaN(amount) || amount <= 0) {
    return "Invalid amount";
  }

  if (description.length === 0) {
    return "Description cannot be empty";
  }

  return null;
};

export async function deposit({
  amount,
  description,
  source = SpaceTransactionDeposit.MAGIC,
}: {
  amount: number;
  description: string;
  source: SpaceTransactionDeposit;
}): Promise<CreateTransactionResult> {
  const session = await getServerSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const inputError = getGenericInputError(amount, description);
  if (inputError) {
    return {
      success: false,
      error: inputError,
    };
  }

  await create({
    amount,
    type: TransactionType.DEPOSIT,
    source,
    actorId: session.user.id,
    comment: description,
  });

  revalidateTag("space-transactions");
  return { success: true };
}

export async function withdraw({
  amount,
  description,
  source = SpaceTransactionWithdrawal.MAGIC,
}: {
  amount: number;
  description: string;
  source: SpaceTransactionWithdrawal;
}): Promise<CreateTransactionResult> {
  const session = await getServerSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const inputError = getGenericInputError(amount, description);
  if (inputError) {
    return {
      success: false,
      error: inputError,
    };
  }

  await create({
    amount,
    type: TransactionType.WITHDRAWAL,
    // @ts-expect-error Some sort of weird Prisma behavior.
    // For WITHDRAWAL transaction it requires a "sourcew" field instead of "source"
    source: source,
    actorId: session.user.id,
    comment: description,
  });

  revalidateTag("space-transactions");
  return { success: true };
}
