"use client";

import React from "react";
import { unsubscribe as unsubscribeAction } from "./action";

export function UnsubscribeButton({
  memberId,
  membershipId,
}: {
  memberId: string;
  membershipId: string;
}) {
  const unsubscribe = async () => {
    const result = await unsubscribeAction({
      memberId,
      membershipId,
    });

    if (!result.success) {
      console.error(result.error);
    }
  };

  return (
    <div className="px-6 py-4 text-right w-full font-medium text-blue-600">
      <span className="hover:underline cursor-pointer" onClick={unsubscribe}>
        Unsubscribe
      </span>
    </div>
  );
}
