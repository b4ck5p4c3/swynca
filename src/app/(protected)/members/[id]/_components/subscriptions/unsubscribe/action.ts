"use server";

import { Record, Static, String } from "runtypes";
import { revalidateTag } from "next/cache";
import { unsubscribe as unsubscribeInDatabase } from "@/lib/subscription";

const UnsubscribeRequest = Record({
  memberId: String,
  membershipId: String,
});

type UnsubscribeRequestType = Static<typeof UnsubscribeRequest>;

type Result =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function unsubscribe(
  request: UnsubscribeRequestType,
): Promise<Result> {
  if (!UnsubscribeRequest.validate(request).success) {
    return {
      success: false,
      error: "Wrong request format",
    };
  }

  await unsubscribeInDatabase(request.memberId, request.membershipId);

  revalidateTag("subscription");
  return {
    success: true,
  };
}
