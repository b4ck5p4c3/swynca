"use client";

import { Member, MemberStatuses } from "@prisma/client";
import { MemberPropertyText } from "./text";
import React from "react";
import {MemberBalanceDTO} from "@/data/balance/fetch";

const STATUS_STRINGS = {
  [MemberStatuses.ACTIVE]: "Active",
  [MemberStatuses.FROZEN]: "Frozen",
};

export function MemberProperties({
  member,
  canEdit,
  balanceData
}: {
  member: Member;
  canEdit: boolean;
  balanceData: MemberBalanceDTO
}) {
  return (
    <div className="flex flex-col grow-[1] gap-2">
      <MemberPropertyText
        title={"Name"}
        value={member.name}
        canEdit={canEdit}
        onChange={(value) => {}}
      />
      <MemberPropertyText
        title={"Email"}
        value={member.email}
        canEdit={canEdit}
        onChange={(value) => {}}
      />
      <MemberPropertyText
        title={"Status"}
        value={STATUS_STRINGS[member.status]}
        canEdit={false}
      />
      <MemberPropertyText
        title={"Joined at"}
        value={member.joinedAt.toISOString()}
        canEdit={false}
      />
      <MemberPropertyText
        title={"Balance"}
        value={balanceData.amount}
        canEdit={false}
      />
      <MemberPropertyText
        title={"Next month balance"}
        value={balanceData.amountAfterSubscriptionRenew}
        canEdit={false}
      />
    </div>
  );
}
