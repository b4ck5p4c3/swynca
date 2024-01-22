import { MemberTransaction, Prisma, SpaceTransaction } from "@prisma/client";
import prisma from "../db";
import { CreateInput as CreateInputMemberTransaction, createMemberTransaction, getBalance } from "../member-transaction";
import { getActiveSubscriptions } from "../subscription";
import { CreateInput as CreateInputSpaceTransaction, createSpaceTransaction } from "../space-transaction";

/**
 * Represents a balance flow entry.
 */
export type BalanceFlowEntry = {
  member: {
    id: string;
    name: string;
  };
  balance: Prisma.Decimal;
  monthlyExpenses: Prisma.Decimal;
};

/**
 * Fetch active members, their balances and ongoing subscriptions
 */
export async function getMembersSubscriptionData(): Promise<any[]> {
  return await prisma.member.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      Balance: {
        select: {
          amount: true,
        },
      },
      MembershipSubscriptionHistory: {
        where: {
          declinedAt: null,
        },
        include: {
          membership: {
            select: {
              amount: true,
            },
          },
        },
      },
    },
  }) as [];
}

/**
 * Retrieves the balance flow for all members.
 * @returns A Promise that resolves to an array of BalanceFlowEntry objects.
 */
export async function getBalancesFlow(): Promise<BalanceFlowEntry[]> {
  const data = await getMembersSubscriptionData();

  // Calculate the monthly expenses for each member,
  // and return along with the current balance
  return data.map((member) => ({
    member: {
      id: member.id,
      name: member.name,
    },
    balance: member.Balance?.amount ?? new Prisma.Decimal(0),
    monthlyExpenses: member.MembershipSubscriptionHistory.reduce(
      (sum: any, el: any) => el.membership.amount.add(sum),
      new Prisma.Decimal(0),
    ),
  }));
}

/**
 * Handles a donation by a member.
 * @param member - The ID of the member.
 * @param amount - The amount to be donated.
 * @param description - (Optional) A description of the donation.
 * @param options - (Optional) Additional options for the donation.
 * @param options.actorId - The ID of the actor initiating the donation.
 *
 * @returns An object containing the space transaction and member transaction.
 */
export async function donate(
  member: string,
  amount: Prisma.Decimal,
  description?: string,
  options?: {
    actorId: string;
  },
): Promise<{
  spaceTransaction: SpaceTransaction;
  memberTransaction: MemberTransaction;
}> {
  const memberTransaction = await createMemberTransaction({
    amount,
    source: "DONATE",
    subjectId: member,
    type: "DEPOSIT",
    comment: description,
    actorId: options?.actorId,
  } as CreateInputMemberTransaction);
  const spaceTransaction = await createSpaceTransaction({
    type: "DEPOSIT",
    source: "DONATE",
    amount,
    comment: description,
    actorId: options?.actorId,
  } as CreateInputSpaceTransaction);

  return {
    memberTransaction,
    spaceTransaction,
  };
}

/**
 * Handles a balance top-up by a member (unused for now).
 * @param amount
 * @param description
 */
/*
export async function topUp(
  amount: Prisma.Decimal,
  description?: string,
): Promise<MemberTransaction> {}
*/
