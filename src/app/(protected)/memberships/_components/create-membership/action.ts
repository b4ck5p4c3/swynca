"use server";

import { getServerSession } from "@/lib/auth/wrapper";
import { create, update } from "lib/membership";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { Boolean, Record, Static, String } from "runtypes";

const MAX_AMOUNT = new Prisma.Decimal(10).pow(10);

const CreateRequest = Record({
  title: String,
  amount: String,
});

type CreateRequestType = Static<typeof CreateRequest>;

const UpdateRequest = Record({
  id: String,
  title: String,
  amount: String,
  active: Boolean,
});

type UpdateRequestType = Static<typeof UpdateRequest>;

type Result =
  | {
      success: true;
      error?: undefined;
    }
  | {
      success: false;
      error: string;
    };

const getGenericInputError = (title: string, amount: Prisma.Decimal) => {
  if (amount.lessThanOrEqualTo(0)) {
    return "Invalid amount";
  }

  if (amount.greaterThanOrEqualTo(MAX_AMOUNT)) {
    return "Invalid amount";
  }

  if (title.length === 0) {
    return "Title cannot be empty";
  }

  return null;
};

export async function add(request: CreateRequestType): Promise<Result> {
  if (!CreateRequest.validate(request).success) {
    return {
      success: false,
      error: "Wrong request format",
    };
  }

  const { title, amount } = request;

  const session = await getServerSession();
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

  const inputError = getGenericInputError(title, decimalAmount);
  if (inputError) {
    return {
      success: false,
      error: inputError,
    };
  }

  await create({
    title,
    amount: decimalAmount,
  });

  revalidateTag("memberships");
  return { success: true };
}

export async function edit(request: UpdateRequestType): Promise<Result> {
  if (!UpdateRequest.validate(request).success) {
    return {
      success: false,
      error: "Wrong request format",
    };
  }

  const { id, amount, title, active } = request;

  const session = await getServerSession();
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

  const inputError = getGenericInputError(title, decimalAmount);
  if (inputError) {
    return {
      success: false,
      error: inputError,
    };
  }

  await update(id, {
    title,
    amount: decimalAmount,
    active,
  });

  revalidateTag("memberships");
  return { success: true };
}
