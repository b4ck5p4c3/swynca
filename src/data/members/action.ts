"use server";
import { getSession } from '@/app/auth';
import { create } from '@/lib/member';
import { ActionGenericError } from '@/types/data';
import { Record, String } from 'runtypes';

export type CreateMemberResponse = ActionGenericError | {
  success: true;
  id: string;
}

export type CreateMemberRequest = {
  email: string;
  name: string;
  username: string;
};

const CreateMemberRequest = Record({
  email: String,
  name: String,
  username: String
});

export default async function createMember(data: CreateMemberRequest): Promise<CreateMemberResponse> {
  // Ensure that the user is authenticated
  await getSession();

  if (!CreateMemberRequest.validate(data).success) {
    return {
      success: false,
      message: 'Incorrect Member data'
    };
  }

  try {
    const member = await create(data);
    return {
      success: true,
      id: member
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
}
