"use client";

import classNames from "classnames";
import { useEffect, useState } from "react";
import { KeyType } from "@prisma/client";
import { subscribe } from "./action";

type AddACSKeyModalProps = {
  allowedMemberships: {
    id: string;
    title: string;
    amount: string;
  }[];
  memberId: string;
  visible: boolean;
  onClose: () => void;
};

export function AddMembershipModal({
  allowedMemberships,
  memberId,
  visible,
  onClose,
}: AddACSKeyModalProps) {
  const [membershipId, setMembershipId] = useState("");

  useEffect(() => {
    setMembershipId(
      allowedMemberships.length > 0 ? allowedMemberships[0].id : ""
    );
  }, [allowedMemberships]);

  const submitDisabled = !membershipId;

  if (!visible) {
    return null;
  }

  const addMembership = async () => {
    const result = await subscribe({
      memberId,
      membershipId,
    });

    if (!result.success) {
      console.error(result.error);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative top-20 mx-auto p-5 border max-w-lg w-4/5 shadow-lg rounded-md bg-white gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="lg:text-2xl text-xl font-medium text-gray-900">
            Add new subscription
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-600">Membership</span>
              <select
                className="w-full rounded border border-gray-200 p-3"
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
              >
                {allowedMemberships.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} - {item.amount}
                  </option>
                ))}
              </select>
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
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
