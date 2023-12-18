"use client";

import { useState } from "react";
import { billMembersAction } from "@/app/(protected)/finance/_components/bill-members/action";

const BillMembers: React.FC = ({}) => {
  const [isOpen, setIsOpen] = useState(false);

  const billBtnClick = async () => {
    const result = await billMembersAction()
    if (!result.success) {
      console.error(result);
      return;
    }
  };

  return (
    <>
      {isOpen && <></>}
      <div className="flex gap-2">
        <button
          className="py-3 px-5 w-full text-sm font-medium text-center rounded-md text-white sm:w-auto bg-violet-600"
          onClick={billBtnClick}
        >
          Bill members
        </button>
      </div>
    </>
  );
};

export default BillMembers;
