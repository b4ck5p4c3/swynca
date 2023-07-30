"use client";

import { Member, MemberStatuses } from "@prisma/client";
import { MemberPropertyText } from "./text";
import React from "react";

const STATUS_STRINGS = {
  [MemberStatuses.ACTIVE]: "Active",
  [MemberStatuses.FROZEN]: "Frozen",
};

export function MemberProperties({
  member,
  canEdit,
}: {
  member: Member;
  canEdit: boolean;
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
    </div>
  );
}
