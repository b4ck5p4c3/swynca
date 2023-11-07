import Image from "next/image";
import { MemberProperties } from "./_components/properties/properties";
import { SubscriptionsTable } from "./_components/subscriptions/table";
import { ACSKeyTable } from "./_components/acs/table";
import { notFound } from "next/navigation";
import { getSession } from "@/app/auth";
import { getById } from "@/lib/member";

async function MemberPage(props: { params: { id: string } }) {
  const session = await getSession();

  const id = props.params.id;
  const member = await getById(id);
  if (!member) {
    notFound();
  }

  // @todo fetch avatar
  const image = "";
  const canEdit = session.user.id === member.id;

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
