import classNames from "classnames";
import { fetchAll } from "@/data/memberships/fetch";
import { formatCurrency } from "@/lib/locale";
import CreateMembership from "./_components/CreateMembership";
import EditMembership from "./_components/EditMembership";

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
              <CreateMembership />
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-200 font-semibold">
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
                    "line-through": !membership.active,
                  })}
                >
                  <td
                    className={classNames("px-6 py-4 font-semibold", {
                      "opacity-50": !membership.active,
                    })}
                  >
                    {membership.title}
                  </td>
                  <td
                    className={classNames("px-6 py-4", {
                      "opacity-50": !membership.active,
                    })}
                  >
                    {formatCurrency(membership.amount)}
                  </td>
                  <td
                    className={classNames("px-6 py-4", {
                      "opacity-50": !membership.active,
                    })}
                  >
                    {membership.active ? "Active" : "Disabled"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <EditMembership membership={membership} />
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
