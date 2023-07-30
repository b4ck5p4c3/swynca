import React from "react";
import Image from "next/image";
import { fetch } from "@/lib/member";
import { MemberStatuses, TransactionType } from "@prisma/client";
import { getServerSession } from "@/lib/auth/wrapper";
import { MemberPropertyText } from "./_components/properties/text";
import { MemberProperties } from "./_components/properties/properties";
import classNames from "classnames";
import { formatCurrency } from "@/lib/locale";
import CreateTransactionButton from "../../finance/_components/create-transaction/button";
import { SubscriptionsTable } from "./_components/subscriptions/table";
import { ACSKeyTable } from "./_components/acs/table";
import { TransactionsTable } from "./_components/transactions/table";
import { fetchAll } from "lib/membership";

async function MemberPage(props: { params: { id: string } }) {
  const member = await fetch(props.params.id);
  const session = await getServerSession();

  if (member == null) {
    return null;
  }

  const memberships = await fetchAll();

  const canEdit = session?.user?.id === props.params.id;

  const image = "";

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="">
          <h1 className="text-3xl font-semibold font-mono">
            <span className="text-gray-400">Members /</span> {member.name}
          </h1>
        </div>
        <div className="flex flex-row gap-20">
          <div>
            {image ? (
              <Image
                className="w-72 h-72 rounded-xl"
                src={image}
                alt="user photo"
              />
            ) : (
              <div className="w-72 h-72 text-5xl bg-slate-300 rounded-xl flex justify-center items-center">
                ?
              </div>
            )}
          </div>
          <MemberProperties member={member} canEdit={canEdit} />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <SubscriptionsTable
              subscriptions={member.MembershipSubscriptionHistory}
              memberId={member.id}
              memberships={memberships}
            />
          </div>
          <div>
            <ACSKeyTable acsKeys={member.ACSKey} memberId={member.id} />
          </div>
        </div>
        {/* <TransactionsTable/> */}
      </div>
    </>
  );
}

export default MemberPage;
