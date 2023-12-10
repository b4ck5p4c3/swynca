"use client";

import { useState } from "react";

const BillMembers: React.FC = ({}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <></>}
      <div className="flex gap-2">
        <button
          className="py-3 px-5 w-full text-sm font-medium text-center rounded-md text-white sm:w-auto bg-violet-600"
          onClick={() => setIsOpen(true)}
        >
          Bill members
        </button>
      </div>
    </>
  );
};

export default BillMembers;
