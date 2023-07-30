"use client";

import React from "react";
import { deleteACSKey } from "./action";

export function DeleteACSKeyButton({ id }: { id: string }) {
  const deleteKey = async () => {
    const result = await deleteACSKey({
      id,
    });
    if (!result.success) {
      console.error(result.error);
    }
  };

  return (
    <div className="px-6 py-4 text-right w-full font-medium text-blue-600">
      <span className="cursor-pointer hover:underline" onClick={deleteKey}>
        Delete
      </span>
    </div>
  );
}
