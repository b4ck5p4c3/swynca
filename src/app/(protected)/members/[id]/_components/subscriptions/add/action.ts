"use server";

import { Record, Static, String } from "runtypes";
import { exists as memberExists } from "@/lib/member";
import { revalidateTag } from "next/cache";
import { exists as membershipExists } from "@/lib/membership";
import { activeExists, add } from "@/lib/subscription";

const SubscribeRequest = Record({
  memberId: String,
  membershipId: String,
});

type SubscribeRequestType = Static<typeof SubscribeRequest>;

type Result =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function subscribe(
  request: SubscribeRequestType,
): Promise<Result> {
  if (!SubscribeRequest.validate(request).success) {
    return {
      success: false,
      error: "Wrong request format",
    };
  }

  if (!(await memberExists(request.memberId))) {
    return {
      success: false,
      error: "Member not found",
    };
  }

  if (!(await membershipExists(request.membershipId))) {
    return {
      success: false,
      error: "Membership not found",
    };
  }

  if (await activeExists(request.memberId, request.membershipId)) {
    return {
      success: false,
      error: "Subscription already exists",
    };
  }

  await add(request.memberId, request.membershipId);
  revalidateTag("subscription");
  return {
    success: true,
  };
}
