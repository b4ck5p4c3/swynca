"use server";

import { getSession } from "@/app/auth";
import { create } from "@/lib/member";
import { ActionGenericError } from "@/types/data";
import { Record, Static, String } from "runtypes";

const CreateMemberRequest = Record({
  email: String,
  name: String,
  username: String,
});

export type CreateMemberRequest = Static<typeof CreateMemberRequest>;

export type CreateMemberResponse =
  | ActionGenericError
  | {
      success: true;
      id: string;
    };

export default async function createMember(
  request: CreateMemberRequest,
): Promise<CreateMemberResponse> {
  // Ensure that the user is authenticated
  await getSession();

  if (!CreateMemberRequest.validate(request).success) {
    return {
      success: false,
      message: "Incorrect Member data",
    };
  }

  try {
    const member = await create(request);
    return {
      success: true,
      id: member,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
