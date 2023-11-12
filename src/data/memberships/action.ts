"use server";

import { create, update } from "lib/membership";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { Boolean, Record, Static, String } from "runtypes";
import { getSession } from "@/app/auth";
import { ActionGenericError } from "@/types/data";
import { isSubscriptionTitle } from "@/lib/validation";
import { Decimal } from "@prisma/client/runtime/library";

const MAX_AMOUNT = new Prisma.Decimal(10).pow(10);

const CreateMembershipRequest = Record({
  title: String,
  amount: String,
});

export type CreateMembershipRequest = Static<typeof CreateMembershipRequest>;
export type CreateMembershipResponse = ActionGenericError | { success: true };

const UpdateMembershipRequest = Record({
  id: String,
  title: String,
  amount: String,
  active: Boolean,
});

export type UpdateMembershipRequest = Static<typeof UpdateMembershipRequest>;
export type UpdateMembershipResponse = ActionGenericError | { success: true };

const checkInput = (title: string, amount: Prisma.Decimal): string | null => {
  if (amount.lessThan(0)) {
    return "Amount cannot be negative";
  }

  if (amount.greaterThanOrEqualTo(MAX_AMOUNT)) {
    return "Amount is too large";
  }

  if (!isSubscriptionTitle(title)) {
    return "Title cannot be empty";
  }

  return null;
};

export async function createMembership(
  request: CreateMembershipRequest
): Promise<CreateMembershipResponse> {
  await getSession();

  if (!CreateMembershipRequest.validate(request).success) {
    return {
      success: false,
      message: "Incorrect subscription data",
    };
  }

  const { title } = request;
  let amount: Decimal;

  try {
    amount = new Prisma.Decimal(request.amount).toDecimalPlaces(2);
  } catch (_) {
    return {
      success: false,
      message: "Incorrect amount",
    };
  }

  const error = checkInput(title, amount);
  if (error) {
    return {
      success: false,
      message: error,
    };
  }

  await create({
    title,
    amount,
  });

  revalidateTag("memberships");
  return { success: true };
}

export async function editMembership(
  request: UpdateMembershipRequest
): Promise<UpdateMembershipResponse> {
  await getSession();

  if (!UpdateMembershipRequest.validate(request).success) {
    return {
      success: false,
      message: "Incorrect subscription data",
    };
  }

  const { id, title, active } = request;
  let amount: Decimal;

  try {
    amount = new Prisma.Decimal(request.amount).toDecimalPlaces(2);
  } catch (_) {
    return {
      success: false,
      message: "Incorrect amount",
    };
  }

  const error = checkInput(title, amount);
  if (error) {
    return {
      success: false,
      message: error,
    };
  }

  await update(id, {
    title,
    amount,
    active,
  });

  revalidateTag("memberships");
  return { success: true };
}
