"use client";

import { useState, useTransition } from "react";
import createTransaction from "./action";
import classNames from "classnames";
import { useRouter } from "next/navigation";

export type CreateTransactionModalProps = {
  visible?: boolean;
  onClose?: () => void;
};

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({
  visible,
  onClose,
}) => {
  const { push } = useRouter();
  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="relative top-20 mx-auto p-5 border max-w-lg w-4/5 shadow-lg rounded-md bg-white gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="lg:text-2xl text-xl font-medium text-gray-900">
            Creating (✨) transaction
          </h2>
          <div className="">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-600">Amount</span>
              <input
                type="number"
                name=""
                min="0"
                id=""
                step="0.01"
                placeholder="0.00"
                className="w-full rounded border border-gray-200 text-3xl p-3"
              />
            </div>
          </div>

          <div className="items-center flex flex-row gap-4">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Deposit
            </button>
            <button
              id="ok-btn"
              className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionModal;
