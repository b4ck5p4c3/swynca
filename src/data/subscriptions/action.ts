"use server";

import { Record, Static, String } from "runtypes";
import { isExistsById } from "@/lib/member";
import { revalidateTag } from "next/cache";
import { exists as membershipExists } from "@/lib/membership";
import { activeExists, add, removeSubscription } from "@/lib/subscription";
import { ActionGenericError } from "@/types/data";
import { getSession } from "@/app/auth";

const SubscribeRequest = Record({
  memberId: String,
  membershipId: String,
});

const UnsubscribeRequest = Record({
  subscriptionId: String,
});

export type SubscribeRequest = Static<typeof SubscribeRequest>;
export type SubscribeResponse = ActionGenericError | { success: true };

export type UnsubscribeRequest = Static<typeof UnsubscribeRequest>;
export type UnsubscribeResponse = ActionGenericError | { success: true };

export async function subscribe(
  request: SubscribeRequest
): Promise<SubscribeResponse> {
  await getSession();

  if (!SubscribeRequest.validate(request).success) {
    return {
      success: false,
      message: "Incorrect request data",
    };
  }

  if (!(await isExistsById(request.memberId))) {
    return {
      success: false,
      message: "Member not found",
    };
  }

  if (!(await membershipExists(request.membershipId))) {
    return {
      success: false,
      message: "Membership not found",
    };
  }

  if (await activeExists(request.memberId, request.membershipId)) {
    return {
      success: false,
      message: "Subscription already exists",
    };
  }

  await add(request.memberId, request.membershipId);
  revalidateTag("subscription");
  return {
    success: true,
  };
}

export async function unsubscribe(
  request: UnsubscribeRequest
): Promise<UnsubscribeResponse> {
  await getSession();

  if (!UnsubscribeRequest.validate(request).success) {
    return {
      success: false,
      message: "Incorrect request data",
    };
  }

  await removeSubscription(request.subscriptionId);
  revalidateTag("subscription");
  return {
    success: true,
  };
}
