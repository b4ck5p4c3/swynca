import {MemberStatuses, PrismaClient} from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import React from "react";
import OryAccountManagement from "@/lib/integrations/ory/account-management";

const prisma = new PrismaClient();

async function updateMemberStatus(id: string, status: MemberStatuses) : Promise<boolean> {
  const member = await prisma.member.findUnique({where: {id}});
  const relationRecord = await prisma.externalAuthenticationOry.findUnique({where:{memberId: id}});
  const ident = new OryAccountManagement();
  if (!member || !relationRecord) {
    return false;
  }
  ident.setTraits(member.name, member.email);
  try {
    if (status === MemberStatuses.FROZEN) {
      await ident.disable(relationRecord.oryId);
      await prisma.member.update({where: {id}, data: {status: MemberStatuses.FROZEN}});
    } else {
      await ident.enable(relationRecord.oryId);
      await prisma.member.update({where: {id}, data: {status: MemberStatuses.ACTIVE}});
    }
  } catch (e: any) {
    console.log('updateMemberStatus error', e.response.data);
    return false;
  }
  return true;
}

async function disable(data: FormData) {
  'use server'
  await updateMemberStatus(data.get('id') as string, MemberStatuses.FROZEN);
}

async function enable(data: FormData) {
  'use server'
  await updateMemberStatus(data.get('id') as string, MemberStatuses.ACTIVE);
}

export default async function MembersPage() {
  const members = await prisma.member.findMany();
  return (
    <div className="flex flex-col gap-8">
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
        <div className="w-full text-sm text-left text-gray-500">
          <div className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
            Actions
          </div>
          <div className="text-xs text-gray-700 uppercase bg-gray-200">
            <Link
                href={`/members/add`}
                className="px-6 py-4 text-right"
            >
              Add
            </Link>
            <button className="px-6 py-4 text-right">Delete</button>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
            Active members
            <p className="mt-1 text-sm font-normal text-gray-500">
              List of members who considered as &quot;Active&quot; thus have
              access to internal resources.
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>

            {members
              .filter((m) => m.status === "ACTIVE")
              .map((member, idx) => (
                <tr
                  key={member.id}
                  className={classNames("border-b", {
                    "bg-gray-50": idx % 2,
                    "bg-white": !(idx % 2),
                  })}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {member.name}
                  </th>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4 text-right">
                    <form action={disable}>
                      <input type="hidden" name="id" value={member.id} />
                      <button type="submit">Disable</button>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/members/${member.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
            Inactive members
            <p className="mt-1 text-sm font-normal text-gray-500">
              These members were inactivated. Their subscriptions were frozen,
              and they don&apos;t have access to internal resources.
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {members
              .filter((m) => m.status === "FROZEN")
              .map((member, idx) => (
                <tr
                  key={member.id}
                  className={classNames("border-b", {
                    "bg-gray-50": idx % 2,
                    "bg-white": !(idx % 2),
                  })}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {member.name}
                  </th>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4 text-right">
                    <td className="px-6 py-4 text-right">
                      <form action={enable}>
                        <input type="hidden" name="id" value={member.id} />
                        <button type="submit">Enable</button>
                      </form>
                    </td>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/members/${member.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
