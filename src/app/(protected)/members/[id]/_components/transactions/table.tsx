import React from "react";

export function TransactionsTable() {
  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
      <div className="flex justify-between p-5 items-center">
        <div className="text-lg font-semibold text-left text-gray-900 bg-white">
          Transactions
          <p className="mt-1 text-sm font-normal text-gray-500">
            Movements of user funds
          </p>
        </div>
        <div className=""></div>
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
        <tbody></tbody>
      </table>
    </div>
  );
}
