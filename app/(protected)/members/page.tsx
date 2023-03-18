import { PrismaClient } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function MembersPage() {
  const members = await prisma.member.findMany();
  return (
    <div className="flex flex-col gap-8">
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Active members
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              List of members who considered as &quot;Active&quot; thus have
              access to internal resources.
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
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
                  className={classNames(
                    "border-b dark:bg-gray-800 dark:border-gray-700",
                    { "bg-gray-50": idx % 2, "bg-white": !(idx % 2) }
                  )}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {member.name}
                  </th>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/members/${member.id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
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
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Inactive members
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              These members were inactivated. Their subscriptions were frozen,
              and they don&apos;t have access to internal resources.
            </p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
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
                  className={classNames(
                    "border-b dark:bg-gray-800 dark:border-gray-700",
                    { "bg-gray-50": idx % 2, "bg-white": !(idx % 2) }
                  )}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {member.name}
                  </th>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/members/${member.id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
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
