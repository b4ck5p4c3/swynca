import { PrismaClient } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function SpaceFinancePage() {
  const members = await prisma.member.findMany();
  return (
    <div className="flex flex-col gap-8">
      <div className="">
        <h1 className="text-3xl font-semibold font-mono">
          <span className="text-gray-400">Finance /</span> Space
        </h1>
      </div>
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg p-8 flex flex-col md:flex-row gap-8 md:gap-0 justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-600 font-semibold">Current balance</h3>
          <span className="text-5xl font-semibold">12,744 ₽</span>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-600 font-semibold">Basic expenses</h3>
          <span className="text-5xl font-semibold">65,000 ₽</span>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-600 font-semibold">Difference</h3>
          <span className="text-5xl font-semibold text-red-500">
            &minus; 49,037 ₽
          </span>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
        <div className="flex justify-between p-5 items-center">
          <div className="text-lg font-semibold text-left text-gray-900 bg-white">
            Transactions
            <p className="mt-1 text-sm font-normal text-gray-500">
              Movements of community funds
            </p>
          </div>
          <div className="">
            <a
              href=""
              className="py-3 px-5 w-full text-sm font-medium text-center rounded-sm text-white sm:w-auto bg-violet-600"
            >
              Create
            </a>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
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
                    <Link
                      href={`/members/${member.id}`}
                      className="font-medium text-violet-600 hover:underline"
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
