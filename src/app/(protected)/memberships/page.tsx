import { formatCurrency } from "@/lib/locale";
import classNames from "classnames";
import CreateMembershipButton from "./_components/create-membership/button";
import EditMembershipButton from "./_components/edit-membership/button";
import { fetchAll } from "@/data/memberships/fetch";

export default async function MembershipsPage() {
  const memberships = await fetchAll();

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
          <div className="flex justify-between p-5 items-center">
            <div className="text-lg font-semibold text-left text-gray-900 bg-white">
              Memberships
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
                <th scope="col" className="px-6 py-3"></th>
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
                  <td className="px-6 py-4">{membership.title}</td>
                  <td className="px-6 py-4">
                    {formatCurrency(membership.amount)}
                  </td>
                  <td className="px-6 py-4">
                    {membership.active ? "Active" : "Disabled"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <EditMembershipButton membership={membership} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
