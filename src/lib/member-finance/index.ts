import { Prisma } from "@prisma/client";
import prisma from "../db";
import { getBalance } from "../member-transaction";
import { getActiveSubscriptions } from "../subscription";

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
 * Retrieves the balance flow for all members.
 * @returns A Promise that resolves to an array of BalanceFlowEntry objects.
 */
export async function getBalancesFlow(): Promise<BalanceFlowEntry[]> {
  // Fetch active members, their balances and ongoing subscriptions
  const data = await prisma.member.findMany({
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
  });

  // Calculate the monthly expenses for each member,
  // and return along with the current balance
  return data.map((member) => ({
    member: {
      id: member.id,
      name: member.name,
    },
    balance: member.Balance?.amount ?? new Prisma.Decimal(0),
    monthlyExpenses: member.MembershipSubscriptionHistory.reduce(
      (sum, el) => el.membership.amount.add(sum),
      new Prisma.Decimal(0),
    ),
  }));
}
