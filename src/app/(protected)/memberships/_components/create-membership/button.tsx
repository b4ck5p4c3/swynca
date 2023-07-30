"use client";

import React, { useState } from "react";
import CreateMembershipModal from "./modal";

export default function CreateMembershipButton() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <CreateMembershipModal
        visible={visible}
        onClose={() => setVisible(false)}
      />
      <button
        className="py-3 px-5 w-full text-sm font-medium text-center rounded-sm text-white sm:w-auto bg-green-600"
        onClick={() => setVisible(true)}
      >
        Add new
      </button>
    </>
  );
}
