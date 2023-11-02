import { MembershipSubscription, Prisma } from "@prisma/client";
import React from "react";
import { AddSubscriptionButton } from "./add/button";
import { SubscriptionsHistoryLink } from "./history/link";
import classNames from "classnames";
import { UnsubscribeButton } from "./unsubscribe/button";
import { formatCurrency } from "@/lib/locale";
import { getAll } from "@/lib/membership";

export async function SubscriptionsTable({
  subscriptions,
  memberId,
}: {
  subscriptions: (MembershipSubscription & {
    membership: {
      id: string;
      title: string;
    };
  })[];
  memberId: string;
}) {
  const memberships = await getAll();

  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
      <div className="flex justify-between p-5 items-center">
        <div className="text-lg font-semibold text-left text-gray-900 bg-white">
          Subscriptions
          <p className="mt-1 text-sm font-normal text-gray-500">
            Active user subscriptions
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <AddSubscriptionButton
            memberId={memberId}
            allowedMemberships={memberships
              .filter(
                (membership) =>
                  !subscriptions.find(
                    (subscription) => subscription.membershipId == membership.id
                  )
              )
              .map((item) => ({
                id: item.id,
                title: item.title,
                amount: formatCurrency(item.amount),
              }))}
          />
          <SubscriptionsHistoryLink />
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Active from
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((item, idx) => (
            <tr
              key={item.id}
              className={classNames("border-b", {
                "bg-gray-50": idx % 2,
                "bg-white": !(idx % 2),
              })}
            >
              <td className="px-6 py-4 font-bold">{item.membership.title}</td>
              <td className="px-6 py-4">{item.subscribedAt.toISOString()}</td>
              <td>
                <UnsubscribeButton
                  membershipId={item.membershipId}
                  memberId={item.memberId}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
