import {formatCurrency} from "@/lib/locale";
import classNames from "classnames";
import {fetchAll} from "@/lib/memberships";
import CreateMembershipButton from "./_components/create-membership/button";
import EditMembershipButton, {MembershipDTO} from "./_components/edit-membership/button";
import {Membership} from "@prisma/client";

export function convertToMembershipDTO(membership: Membership): MembershipDTO {
  return {
    id: membership.id,
    title: membership.title,
    amount: membership.amount.toString(),
    active: membership.active
  }
}

export default async function MembershipsPage() {
  const memberships = await fetchAll();

  return (
      <>
        <div className="flex flex-col gap-8">
          <div className="">
            <h1 className="text-3xl font-semibold font-mono">
              <span className="text-gray-400">Memberships</span>
            </h1>
          </div>
          <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
            <div className="flex justify-between p-5 items-center">
              <div className="text-lg font-semibold text-left text-gray-900 bg-white">
                Memberships
                <p className="mt-1 text-sm font-normal text-gray-500">
                  Various memberships for different members
                </p>
              </div>
              <div className="">
                <CreateMembershipButton />
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
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                </th>
              </tr>
              </thead>
              <tbody>
              {memberships.map((membership, idx) => (
                  <tr
                      key={membership.id}
                      className={classNames("border-b", {
                        "bg-gray-50": idx % 2,
                        "bg-white": !(idx % 2),
                      })}
                  >
                    <td className="px-6 py-4">
                      {membership.title}
                    </td>
                    <td className="px-6 py-4">{formatCurrency(membership.amount)}</td>
                    <td className="px-6 py-4">{membership.active ? "Active" : "Disabled"}</td>
                    <td className="px-6 py-4 text-right"><EditMembershipButton membership={convertToMembershipDTO(membership)}/></td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
  );
}
