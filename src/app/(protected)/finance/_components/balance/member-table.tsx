import { fetchMemberBalanceTable } from "@/data/member-transaction/fetch";
import { formatCurrency } from "@/lib/locale";
import classNames from "classnames";

export type MembersBalanceTableProps = {};

const MembersBalanceTable: React.FC<MembersBalanceTableProps> = async ({}) => {
  const data = await fetchMemberBalanceTable();
  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
          <div className="flex justify-between p-5 items-center">
            <div className="text-lg font-semibold text-left text-gray-900 bg-white">
              Balances
            </div>
            <div>{/* <CreateMembership /> */}</div>
          </div>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-200 font-semibold">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Member
                </th>
                <th scope="col" className="px-6 py-3">
                  Due
                </th>
                <th scope="col" className="px-6 py-3">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3">
                  Balance after next payment
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((member, idx) => (
                <tr
                  key={member.id}
                  className={classNames("border-b", {
                    "bg-gray-50": idx % 2,
                    "bg-white": !(idx % 2),
                  })}
                >
                  <td className={classNames("px-6 py-4 font-semibold")}>
                    {member.name}
                  </td>
                  <td className={classNames("px-6 py-4")}>
                    {formatCurrency(member.monthlyExpenses)}
                  </td>
                  <td className={classNames("px-6 py-4")}>
                    {formatCurrency(member.currentBalance)}
                  </td>
                  <td className={classNames("px-6 py-4")}>
                    {formatCurrency(
                      member.currentBalance - member.monthlyExpenses,
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* <EditMembership membership={membership} /> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MembersBalanceTable;
