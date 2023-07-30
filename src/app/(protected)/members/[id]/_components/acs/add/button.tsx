"use client";

import { AddACSKeyModal } from "./modal";
import { useState } from "react";

export function AddACSKeyButton({ memberId }: { memberId: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <AddACSKeyModal
        onClose={() => setVisible(false)}
        visible={visible}
        memberId={memberId}
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
