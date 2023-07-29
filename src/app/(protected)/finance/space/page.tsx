import { prisma } from "@/lib/db";
import classNames from "classnames";
import { getBalance, getBasicExpenses } from "@/lib/space-transactions";
import { formatCurrency } from "@/lib/locale";
import CreateTransactionButton from "../_components/create-transaction/button";
import Pagination from "./pagination";
import { getPagination } from "@/lib/utils/pagination";
import { TransactionType } from "@prisma/client";
import { cache } from "react";

const TRANSACTIONS_PER_PAGE = 1;

type SpaceFinancePageParams = {
  query: {
    page: string;
  };
};

export default async function SpaceFinancePage(params: SpaceFinancePageParams) {
  const currentBalance = await getBalance();
  const basicExpenses = await getBasicExpenses();
  const balanceDifference = currentBalance.sub(basicExpenses);

  const count = await prisma.spaceTransaction.count();
  const pagination = getPagination(
    params.query?.page,
    TRANSACTIONS_PER_PAGE,
    count
  );

  const transactions = await prisma.spaceTransaction.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: { Actor: { select: { name: true } } },
    skip: pagination.offset,
    take: pagination.perPage,
  });

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="">
          <h1 className="text-3xl font-semibold font-mono">
            <span className="text-gray-400">Finance /</span> Space
          </h1>
        </div>
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg p-8 flex flex-col md:flex-row gap-8 md:gap-0 justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-600 font-semibold">Current balance</h3>
            <span className="text-5xl font-semibold">
              {formatCurrency(currentBalance, true)}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-600 font-semibold">Basic expenses</h3>
            <span className="text-5xl font-semibold">
              {formatCurrency(basicExpenses, true)}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-600 font-semibold">Difference</h3>
            <span
              className={classNames("text-5xl font-semibold", {
                "text-red-500": balanceDifference.lessThan(0),
                "text-green-500": balanceDifference.greaterThan(0),
              })}
            >
              {formatCurrency(balanceDifference, true)}
            </span>
          </div>
        </div>
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
                      }
                    )}
                  >
                    {transaction.type === TransactionType.DEPOSIT ? "+" : "-"}{" "}
                    {formatCurrency(transaction.amount)}
                  </th>
                  <td className="px-6 py-4">
                    {transaction.createdAt.toISOString()}
                  </td>
                  <td className="px-6 py-4">{transaction.comment}</td>
                  <td className="px-6 py-4">{transaction.Actor?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <Pagination pagination={pagination} />
        </div>
      </div>
    </>
  );
}
