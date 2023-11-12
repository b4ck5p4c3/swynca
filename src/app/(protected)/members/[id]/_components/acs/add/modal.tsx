"use client";

import classNames from "classnames";
import { useState } from "react";
import { KeyType } from "@prisma/client";
import { add } from "./action";

type AddACSKeyModalProps = {
  memberId: string;
  visible: boolean;
  onClose: () => void;
};

export function AddACSKeyModal({
  memberId,
  visible,
  onClose,
}: AddACSKeyModalProps) {
  const [acsKey, setACSKey] = useState("");
  const [keyType, setKeyType] = useState<KeyType>(KeyType.UID);

  const submitDisabled = !acsKey.match(/^((([0-9A-F])([0-9A-F]))+)$/);

  if (!visible) {
    return null;
  }

  const addACSKey = async () => {
    const result = await add({
      memberId,
      key: acsKey,
      type: keyType,
    });

    if (!result.success) {
      console.error(result.error);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative top-20 mx-auto p-5 border max-w-lg w-4/5 shadow-lg rounded-md bg-white gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="lg:text-2xl text-xl font-medium text-gray-900">
            Add new ACS key
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-600">Key type</span>
              <select
                className="w-full rounded border border-gray-200 p-3"
                value={keyType}
                onChange={(e) => setKeyType(e.target.value as KeyType)}
              >
                {Object.values(KeyType).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-600">ACS key</span>
              <input
                type="text"
                placeholder="1337... (in hex)"
                className="w-full rounded border border-gray-200 p-3"
                value={acsKey}
                onChange={(e) => setACSKey(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="items-center flex flex-row gap-4">
            <button
              className={classNames(
                "px-4 py-2 text-white text-base font-medium rounded-md w-full shadow-sm",
                {
                  ["bg-green-500 hover:bg-green-600"]: !submitDisabled,
                  ["bg-gray-400 cursor-not-allowed hover:bg-gray-400"]:
                    submitDisabled,
                },
              )}
              disabled={submitDisabled}
              onClick={addACSKey}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
