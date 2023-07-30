"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SpaceTransactionDeposit,
  SpaceTransactionWithdrawal,
  TransactionType,
} from "@prisma/client";
import classNames from "classnames";
import { add } from "./action";

export type CreateMembershipProps = {
  visible: boolean;
  onClose: () => void;
};

function CreateMembershipModal({
  visible,
  onClose,
}: CreateMembershipProps) {
  const { refresh } = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const submitDisabled = !amount || !title;

  const currencySymbol = useMemo(
    () =>
      new Intl.NumberFormat(process.env.NEXT_PUBLIC_SWYNCA_LOCALE, {
        style: "currency",
        currency: process.env.NEXT_PUBLIC_SWYNCA_CURRENCY,
      }).formatToParts(0)[4].value,
    []
  );

  const addMembership = async () => {
    const result = await add({
      title,
      amount,
    });

    if (!result.success) {
      console.error(result);
      return;
    }

    refresh();
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      onTouchStart={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="relative top-20 mx-auto p-5 border max-w-lg w-4/5 shadow-lg rounded-md bg-white gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="lg:text-2xl text-xl font-medium text-gray-900">
            Add new membership
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-600">Title</span>
              <textarea
                placeholder="Membership title"
                className="w-full rounded border border-gray-200 p-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-600">Amount</span>
              <div className="flex gap-2 items-center">
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  name=""
                  min="0"
                  id=""
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded border border-gray-200 text-3xl p-3"
                />
                <span className="text-3xl">{currencySymbol}</span>
              </div>
            </div>
          </div>

          <div className="items-center flex flex-row gap-4">
            <button
              className={classNames(
                "px-4 py-2 text-white text-base font-medium rounded-md w-full shadow-sm",
                {
                  ["bg-green-500 hover:bg-green-600"]: !submitDisabled,
                  ["bg-gray-400 cursor-not-allowed hover:bg-gray-400"]:
                    submitDisabled,
                }
              )}
              disabled={submitDisabled}
              onClick={addMembership}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateMembershipModal;
