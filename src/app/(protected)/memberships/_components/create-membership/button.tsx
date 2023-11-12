"use client";

import React, { useState } from "react";
import CreateMembershipModal from "./modal";

export default function CreateMembershipButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <CreateMembershipModal onClose={() => setIsOpen(false)} />}
      <button
        className="py-3 px-5 w-full text-sm font-medium text-center rounded-md text-white sm:w-auto bg-violet-600"
        role="button"
        onClick={() => setIsOpen(true)}
      >
        Create
      </button>
    </>
  );
}
