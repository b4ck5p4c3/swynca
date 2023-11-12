import { MemberStatuses } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import { ReactNode } from "react";

export type MembersTableProps = {
  members: {
    id: string;
    name: string;
    username: string;
    status: MemberStatuses;
  }[];
  title: string;
  subtitle: string;
  children?: ReactNode;
};

const MembersTable: React.FC<MembersTableProps> = ({
  title,
  subtitle,
  members,
  children,
}) => {
  return (
    <table className="w-full text-sm text-left text-gray-500">
      <caption className="p-5">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-left text-gray-900 bg-white">
            {title}
            <p className="mt-1 text-sm font-normal text-gray-500">{subtitle}</p>
          </div>
          <div>{children}</div>
        </div>
      </caption>
      <thead className="text-xs text-gray-700 uppercase bg-gray-200">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Username
          </th>
          <th scope="col" className="px-6 py-3">
            <span className="sr-only">Actions</span>
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
              <td className="px-6 py-4">{member.username}</td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/members/${member.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default MembersTable;
