import classNames from "classnames";
import { formatCurrency, formatDateTimeShort } from "@/lib/locale";
import CreateTransactionButton from "./button";
import Pagination from "./pagination";
import { getPagination } from "@/lib/utils/pagination";
import { TransactionType } from "@prisma/client";
import {
  fetchSpaceTransactions,
  fetchSpaceTransactionsCount,
} from "@/data/space-finance/fetch";

const TRANSACTIONS_PER_PAGE = 100;

export type SpaceFinanceTableProps = {
  page?: string;
};

const SpaceTransactionsTable: React.FC<SpaceFinanceTableProps> = async ({
  page,
}) => {
  const count = await fetchSpaceTransactionsCount();
  const pagination = getPagination(page, TRANSACTIONS_PER_PAGE, count);

  const transactions = await fetchSpaceTransactions({
    pageNumber: pagination.page,
    pageSize: pagination.perPage,
  });

  return (
    <>
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
        <div className="flex justify-between p-5 items-center">
          <div className="text-lg font-semibold text-left text-gray-900 bg-white">
            Transactions
            <p className="mt-1 text-sm font-normal text-gray-500">
              Movements of community funds
            </p>
          </div>
          <div className="">
            <CreateTransactionButton />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Made by
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, idx) => (
              <tr
                key={transaction.id}
                className={classNames("border-b", {
                  "bg-gray-50": idx % 2,
                  "bg-white": !(idx % 2),
                })}
              >
                <th
                  scope="row"
                  className={classNames(
                    "px-6 py-4 font-medium whitespace-nowrap",
                    {
                      "text-red-500":
                        transaction.type === TransactionType.WITHDRAWAL,
                      "text-green-500":
                        transaction.type === TransactionType.DEPOSIT,
                    },
                  )}
                >
                  {transaction.type === TransactionType.DEPOSIT ? "+" : "-"}{" "}
                  {formatCurrency(transaction.amount)}
                </th>
                <td className="px-6 py-4">
                  {formatDateTimeShort(transaction.createdAt)}
                </td>
                <td className="px-6 py-4">{transaction.comment}</td>
                <td className="px-6 py-4">{transaction.actor?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ml-5">
          <Pagination pagination={pagination} />
        </div>
      </div>
    </>
  );
};

export default SpaceTransactionsTable;
