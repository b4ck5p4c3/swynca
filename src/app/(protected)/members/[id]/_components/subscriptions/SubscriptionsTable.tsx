import classNames from "classnames";
import { GetMemberHistoryDTO } from "@/data/subscriptions/fetch";
import { fetchAll } from "@/data/memberships/fetch";
import Subscribe from "./Subscribe";
import Unsubscribe from "./Unsubscribe";
import { formatCurrency, formatDateShort } from "@/lib/locale";

export type SubscriptionsTableProps = {
  subscriptions: GetMemberHistoryDTO;
  memberId: string;
};

const SubscriptionsTable: React.FC<SubscriptionsTableProps> = async ({
  subscriptions,
  memberId,
}) => {
  const memberships = await fetchAll();
  const signedUpMemberships = subscriptions
    .filter((s) => !s.declinedAt)
    .map((s) => s.membership.id);

  const availableMemberships = memberships.filter(
    (m) => !signedUpMemberships.includes(m.id)
  );

  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
      <div className="flex justify-between p-5 items-center">
        <div className="text-lg font-semibold text-left text-gray-900 bg-white">
          Subscriptions
          <p className="mt-1 text-sm font-normal text-gray-500">
            History of active and past subscriptions
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Subscribe
            memberId={memberId}
            availableMemberships={availableMemberships}
          />
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Amount
            </th>
            <th scope="col" className="px-6 py-3">
              Dates
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription, idx) => (
            <tr
              key={subscription.id}
              className={classNames("border-b", {
                "bg-gray-50": idx % 2,
                "bg-white": !(idx % 2),
                "line-through opacity-50": subscription.declinedAt,
              })}
            >
              <td className="px-6 py-4 font-bold">
                {subscription.membership.title}
              </td>
              <td className="px-6 py-4 font-bold">
                {formatCurrency(subscription.membership.amount)}
              </td>
              <td className="px-6 py-4">
                <span className="!no-underline">
                  {formatDateShort(subscription.subscribedAt)}
                  {!!subscription.declinedAt && (
                    <> - {formatDateShort(subscription.declinedAt)}</>
                  )}
                </span>
              </td>
              <td>
                <div className="flex justify-end items-center px-2">
                  {!subscription.declinedAt && (
                    <Unsubscribe subscriptionId={subscription.id} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionsTable;
