import classNames from "classnames";
import { KeyType } from "@prisma/client";
import { CreditCardIcon, KeyIcon } from "@heroicons/react/24/outline";
import { KeyDTO } from "@/data/acs/fetch";
import KeyDelete from "./KeyDelete";
import KeyAdd from "./KeyAdd";

const ICONS = {
  [KeyType.PAN]: <CreditCardIcon className={"h-8"} />,
  [KeyType.UID]: <KeyIcon className={"h-8"} />,
};

export type KeyTableProps = {
  memberId: string;
  keys: KeyDTO[];
};

const KeyTable: React.FC<KeyTableProps> = ({ memberId, keys }) => {
  return (
    <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
      <div className="flex justify-between p-5 items-center">
        <div className="text-lg font-semibold text-left text-gray-900 bg-white">
          Access Control
          <p className="mt-1 text-sm font-normal text-gray-500">
            Keys granting physical access to the space
          </p>
        </div>
        <KeyAdd memberId={memberId} />
      </div>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Identifier
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key, idx) => (
            <tr
              key={key.id}
              className={classNames("border-b", {
                "bg-gray-50": idx % 2,
                "bg-white": !(idx % 2),
              })}
            >
              <td className="px-6 py-4">{ICONS[key.type]}</td>
              <td className="px-6 py-4 font-bold">{key.name}</td>
              <td className="px-6 py-4 font-mono">{key.key.toUpperCase()}</td>
              <td>
                <div className="flex justify-end items-center px-2">
                  <KeyDelete id={key.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeyTable;
