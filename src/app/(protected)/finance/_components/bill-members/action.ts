"use server";

import { makeWithdrawTransactions } from "@/lib/member-transaction";
import { getSession } from "@/app/auth";

type BillActionResult =
  | {
  success: true;
  error?: undefined;
}
  | {
  success: false;
  error: string;
};

export async function billMembersAction(): Promise<BillActionResult>
{
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await makeWithdrawTransactions(session.user.id);
  } catch (e) {
    return {
      success: false,
      error: 'Action error',
    };
  }

  return { success: true };
}
