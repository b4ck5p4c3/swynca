"use server";

import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { Literal, Optional, Record, Static, String, Union } from "runtypes";
import { getSession } from "@/app/auth";
import { ActionGenericError } from "@/types/data";
import { isTransactionDescription } from "@/lib/validation";
import { Decimal } from "@prisma/client/runtime/library";
import { createSpaceTransaction } from "@/lib/space-transaction";
import { getById, isExistsById } from "@/lib/member";

const MAX_AMOUNT = new Prisma.Decimal(10).pow(10);

const DepositRequest = Record({
  amount: String,
  description: String,
  source: Union(Literal("MAGIC"), Literal("DONATE"), Literal("MEMBERSHIP")),
});

export type DepositRequest = Static<typeof DepositRequest>;
export type DepositResponse = ActionGenericError | { success: true };

const WithdrawRequest = Union(
  Record({
    amount: String,
    description: String,
    target: Literal("GIFT"),
    gifter: Optional(String),
  }),
  Record({
    amount: String,
    description: String,
    target: Union(Literal("MAGIC"), Literal("BASIC"), Literal("PURCHASES")),
  }),
);

export type WithdrawRequest = Static<typeof WithdrawRequest>;
export type WithdrawResponse = ActionGenericError | { success: true };

const checkInput = (
  description: string,
  amount: Prisma.Decimal,
): string | null => {
  if (amount.lessThan(0)) {
    return "Amount cannot be negative";
  }

  if (amount.greaterThanOrEqualTo(MAX_AMOUNT)) {
    return "Amount is too large";
  }

  if (!isTransactionDescription(description)) {
    return "Title cannot be empty";
  }

  return null;
};

export async function createDeposit(
  request: DepositRequest,
): Promise<DepositResponse> {
  const { user } = await getSession();

  if (!DepositRequest.validate(request).success) {
    return {
      success: false,
      message: "Incorrect transaction data",
    };
  }

  const { description } = request;
  let amount: Decimal;

  try {
    amount = new Prisma.Decimal(request.amount).toDecimalPlaces(2);
  } catch (_) {
    return {
      success: false,
      message: "Incorrect amount",
    };
  }

  const error = checkInput(description, amount);
  if (error) {
    return {
      success: false,
      message: error,
    };
  }

  const tx = await createSpaceTransaction({
    type: "DEPOSIT",
    amount,
    source: request.source,
    actorId: user.id,
    comment: description,
  });

  // @todo audit log entry for tx

  return { success: true };
}

export async function createWithdrawal(
  request: WithdrawRequest,
): Promise<WithdrawResponse> {
  const { user } = await getSession();

  if (!DepositRequest.validate(request).success) {
    return {
      success: false,
      message: "Incorrect transaction data",
    };
  }

  const { description } = request;
  let amount: Decimal;

  try {
    amount = new Prisma.Decimal(request.amount).toDecimalPlaces(2);
  } catch (_) {
    return {
      success: false,
      message: "Incorrect amount",
    };
  }

  const error = checkInput(description, amount);
  if (error) {
    return {
      success: false,
      message: error,
    };
  }

  if (request.target === "GIFT") {
    // If gifter is specified, create a Member Donate TX
    if (request.gifter) {
      const gifter = await getById(request.gifter);
      if (!gifter) {
        return {
          success: false,
          message: "Gifter does not exist",
        };
      }
    }
    // 1. create member donation transaction
    // 2. create space withdrawal purchase transaction
    return { success: true };
  }

  const tx = await createSpaceTransaction({
    type: "WITHDRAWAL",
    amount,
    target: request.target,
    actorId: user.id,
    comment: description,
  });

  // @todo audit log entry for tx
  return { success: true };
}
