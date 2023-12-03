"use server";

import { getSession } from "@/app/auth";
import { create } from "@/lib/space-transaction";
import { Prisma, TransactionType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { Literal, Record, Static, String, Union } from "runtypes";

const MAX_AMOUNT = new Prisma.Decimal(10).pow(10);

const DepositRequest = Record({
  amount: String,
  description: String,
  // @todo use Prisma generated type instead
  source: Union(Literal("MAGIC"), Literal("DONATE"), Literal("MEMBERSHIP")),
});

type DepositRequestType = Static<typeof DepositRequest>;

const WithdrawRequest = Record({
  amount: String,
  description: String,
  // @todo use Prisma generated type instead
  target: Union(Literal("MAGIC"), Literal("BASIC"), Literal("PURCHASES")),
});

type WithdrawRequestType = Static<typeof WithdrawRequest>;

type CreateTransactionResult =
  | {
      success: true;
      error?: undefined;
    }
  | {
      success: false;
      error: string;
    };

const getGenericInputError = (amount: Prisma.Decimal, description: string) => {
  if (amount.lessThanOrEqualTo(0)) {
    return "Invalid amount";
  }

  if (amount.greaterThanOrEqualTo(MAX_AMOUNT)) {
    return "Invalid amount";
  }

  if (description.length === 0) {
    return "Description cannot be empty";
  }

  return null;
};

export async function deposit(
  request: DepositRequestType,
): Promise<CreateTransactionResult> {
  if (!DepositRequest.validate(request).success) {
    return {
      success: false,
      error: "Wrong request format",
    };
  }

  const { amount, description, source } = request;

  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  let decimalAmount: Prisma.Decimal;
  try {
    decimalAmount = new Prisma.Decimal(amount).toDecimalPlaces(2);
  } catch (e) {
    return {
      success: false,
      error: "Invalid amount format",
    };
  }

  const inputError = getGenericInputError(decimalAmount, description);
  if (inputError) {
    return {
      success: false,
      error: inputError,
    };
  }

  await create({
    amount: decimalAmount,
    type: TransactionType.DEPOSIT,
    source,
    actorId: session.user.id,
    comment: description,
  });

  revalidateTag("space-transactions");
  return { success: true };
}

export async function withdraw(
  request: WithdrawRequestType,
): Promise<CreateTransactionResult> {
  if (!WithdrawRequest.validate(request).success) {
    return {
      success: false,
      error: "Wrong request format",
    };
  }

  const { amount, description, target } = request;

  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  let decimalAmount: Prisma.Decimal;
  try {
    decimalAmount = new Prisma.Decimal(amount).toDecimalPlaces(2);
  } catch (e) {
    return {
      success: false,
      error: "Invalid amount format",
    };
  }

  const inputError = getGenericInputError(decimalAmount, description);
  if (inputError) {
    return {
      success: false,
      error: inputError,
    };
  }

  await create({
    amount: decimalAmount,
    type: TransactionType.WITHDRAWAL,
    target: target,
    actorId: session.user.id,
    comment: description,
  });

  revalidateTag("space-transactions");
  return { success: true };
}
