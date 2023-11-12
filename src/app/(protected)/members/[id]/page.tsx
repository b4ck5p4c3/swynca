import { MemberProperties } from "./_components/properties/properties";
import { notFound } from "next/navigation";
import { getSession } from "@/app/auth";
import { getById } from "@/lib/member";
import { fetchMemberHistory } from "@/data/subscriptions/fetch";
import SubscriptionsTable from "./_components/subscriptions/SubscriptionsTable";
import KeyTable from "./_components/acs/KeyTable";
import { fetchMemberKeys } from "@/data/acs/fetch";

async function MemberPage(props: { params: { id: string } }) {
  const { user } = await getSession();

  const id = props.params.id;
  const member = await getById(id);
  if (!member) {
    notFound();
  }

  const canEdit = user.id === member.id;
  const membershipHistory = await fetchMemberHistory(member.id);
  const acsKeys = await fetchMemberKeys(member.id);

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="">
          <h1 className="text-3xl font-semibold font-mono">
            <span className="text-gray-400">Members /</span> {member.name}
          </h1>
        </div>
        <div className="flex flex-row">
          <MemberProperties member={member} canEdit={canEdit} />
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <KeyTable keys={acsKeys} memberId={member.id} />
          </div>
          <div>
            <SubscriptionsTable
              subscriptions={membershipHistory}
              memberId={member.id}
            />
          </div>
        </div>
        {/* <TransactionsTable/> */}
      </div>
    </>
  );
}

export default MemberPage;
