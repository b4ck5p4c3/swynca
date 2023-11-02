import React from "react";
import Image from "next/image";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "@/lib/auth/wrapper";
import { MemberProperties } from "./_components/properties/properties";
import { SubscriptionsTable } from "./_components/subscriptions/table";
import { ACSKeyTable } from "./_components/acs/table";
import { notFound } from "next/navigation";

async function MemberPage(props: { params: { id: string } }) {
  const prisma = new PrismaClient();
  const session = await getServerSession();

  const id = props.params.id;
  const member = await prisma.member.findUnique({
    where: {
      id,
    },
    include: {
      MembershipSubscriptionHistory: {
        include: {
          membership: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        where: {
          declinedAt: null,
        },
      },
      ACSKey: true,
    },
  });

  if (member == null) {
    notFound();
  }

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
