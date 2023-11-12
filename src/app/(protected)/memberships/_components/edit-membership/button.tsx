"use client";

import React, { useState } from "react";
import EditMembershipModal from "./modal";
import { MembershipDTO } from "@/data/memberships/fetch";

export default function EditMembershipButton({
  membership,
}: {
  membership: MembershipDTO;
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
