"use client";

import React, { useState } from "react";
import { Membership } from "@prisma/client";
import CreateMembershipModal from "../create-membership/modal";
import EditMembershipModal from "./modal";

export type MembershipDTO = {
  id: string;
  title: string;
  amount: string;
  active: boolean;
};

export default function EditMembershipButton({
  membership,
}: {
  membership: MembershipDTO,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <EditMembershipModal
        visible={visible}
        onClose={() => setVisible(false)}
        membership={membership}
      />
      <button
        className="py-3 px-5 w-full text-sm font-medium text-center rounded-sm text-white sm:w-auto bg-blue-600"
        onClick={() => setVisible(true)}
      >
        Edit
      </button>
    </>
  );
}
