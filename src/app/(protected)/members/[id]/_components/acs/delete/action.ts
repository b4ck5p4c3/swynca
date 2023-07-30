"use server";

import { Record, Static, String } from "runtypes";
import { deleteKey } from "@/lib/acs";
import { revalidateTag } from "next/cache";

const DeleteRequest = Record({
  id: String,
});

type DeleteRequestType = Static<typeof DeleteRequest>;

type Result =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function deleteACSKey(
  request: DeleteRequestType
): Promise<Result> {
  if (!DeleteRequest.validate(request).success) {
    return {
      success: false,
      error: "Wrong request format",
    };
  }

  await deleteKey(request.id);

  revalidateTag("acs");
  return {
    success: true,
  };
}
