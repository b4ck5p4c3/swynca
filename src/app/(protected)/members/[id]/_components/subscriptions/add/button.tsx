"use client";

import { AddMembershipModal } from "./modal";
import { useState } from "react";

export function AddSubscriptionButton({
  memberId,
  availableMemberships,
}: {
  memberId: string;
  availableMemberships: {
    id: string;
    title: string;
    amount: number;
  }[];
}) {
  const [isVisible, setVisible] = useState(false);

  if (availableMemberships.length === 0) {
    return null;
  }

  return (
    <>
      <AddMembershipModal
        visible={isVisible}
        onClose={() => setVisible(false)}
        memberId={memberId}
        availableMemberships={availableMemberships}
      />
      <div className="flex gap-2">
        <button
          className="py-3 px-5 w-full text-sm font-medium text-center rounded-sm text-white sm:w-auto bg-blue-600"
          onClick={() => setVisible(true)}
        >
          Add
        </button>
      </div>
    </>
  );
}
