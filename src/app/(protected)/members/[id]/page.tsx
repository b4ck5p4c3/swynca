import React from "react";
import Image from "next/image";
import { fetch } from "@/lib/member";
import {MemberStatuses} from "@prisma/client";

const STATUS_STRINGS = {
  [MemberStatuses.ACTIVE]: 'Active',
  [MemberStatuses.FROZEN]: 'Frozen'
};

async function MemberPage(props: { params: { id: string } }) {
  const member = await fetch(props.params.id);

  if (member == null) {
    return null;
  }

  const image = "";

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-row gap-4">
          <div className="flex flex-grow">
            {image ? (
              <Image
                className="w-96 h-96 rounded-xl"
                src={image}
                alt="user photo"
              />
            ) : (
              <div className="w-96 h-96 bg-slate-300 rounded-xl flex justify-center items-center">
                ?
              </div>
            )}
          </div>
          <div className="flex flex-grow">
            <dl>
              <dd>Name</dd>
              <dt>{member.name}</dt>
              <dd>Email</dd>
              <dt>{member.email}</dt>
              <dd>Status</dd>
              <dt>{STATUS_STRINGS[member.status]}</dt>
              <dd>Joined at</dd>
              <dt>{member.joinedAt.toISOString()}</dt>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}

export default MemberPage;