import React from "react";
import MembersTable from "./_components/MembersTable";
import { MemberStatuses } from "@prisma/client";
import { getAll } from "@/data/members/fetch";
import CreateMember from "./_components/CreateMember";

export default async function MembersPage() {
  const members = await getAll();
  const active = members.filter((m) => m.status === MemberStatuses.ACTIVE);
  const frozen = members.filter((m) => m.status === MemberStatuses.FROZEN);

  return (
    <div className="flex flex-col gap-8">
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
        <MembersTable members={active} title="Residents">
          <CreateMember />
        </MembersTable>
      </div>
      {frozen.length > 0 && (
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
          <MembersTable
            members={frozen}
            title="Former Residents"
            subtitle="Members without active subscriptions and access to internal resources."
          />
        </div>
      )}
    </div>
  );
}
