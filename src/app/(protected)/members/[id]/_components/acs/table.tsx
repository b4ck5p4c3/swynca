import {
  ACSKey,
  KeyType,
  Membership,
  MembershipSubscription,
} from "@prisma/client";
import React from "react";
import { AddACSKeyButton } from "./add/button";
import classNames from "classnames";
import { CreditCardIcon, KeyIcon } from "@heroicons/react/24/outline";
import { DeleteACSKeyButton } from "./delete/button";

const TYPE_ICONS = {
  [KeyType.PAN]: () => <CreditCardIcon className={"h-8"} />,
  [KeyType.UID]: () => <KeyIcon className={"h-8"} />,
};

export function ACSKeyTable({
  acsKeys,
  memberId,
}: {
  acsKeys: ACSKey[];
  memberId: string;
}) {
  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
      <div className="flex justify-between p-5 items-center">
        <div className="text-lg font-semibold text-left text-gray-900 bg-white">
          ACS
          <p className="mt-1 text-sm font-normal text-gray-500">
            Current user access cards
          </p>
        </div>
        <div className="">
          <AddACSKeyButton memberId={memberId} />
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Card
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {acsKeys.map((item, idx) => (
            <tr
              key={item.id}
              className={classNames("border-b", {
                "bg-gray-50": idx % 2,
                "bg-white": !(idx % 2),
              })}
            >
              <td className="px-6 py-4 font-bold">{TYPE_ICONS[item.type]()}</td>
              <td className="px-6 py-4">{item.key}</td>
              <td>
                <DeleteACSKeyButton id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
