"use server";

import { Literal, Record, Static, String, Union } from "runtypes";
import { exists } from "@/lib/member";
import { addKey } from "@/lib/acs";
import { revalidateTag } from "next/cache";

const AddRequest = Record({
  memberId: String,
  type: Union(Literal("UID"), Literal("PAN")),
  key: String.withConstraint(
    (value) => !!value.match(/^((([0-9A-F])([0-9A-F]))+)$/)
  ),
});

type AddRequestType = Static<typeof AddRequest>;

type Result =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function add(request: AddRequestType): Promise<Result> {
  if (!AddRequest.validate(request).success) {
    return {
      success: false,
      error: "Wrong request format",
    };
  }

  if (!(await exists(request.memberId))) {
    return {
      success: false,
      error: "Member not found",
    };
  }

  await addKey(request.memberId, request.type, request.key);

  revalidateTag("acs");
  return {
    success: true,
  };
}
