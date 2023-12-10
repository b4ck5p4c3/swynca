"use client";

import { useState } from "react";
import CreateTransactionModal from "./modal";
import { TransactionType } from "@prisma/client";

const CreateTransactionButton: React.FC = ({}) => {
  const [kind, setKind] = useState<TransactionType | null>(null);

  return (
    <>
      {kind && (
        <CreateTransactionModal
          kind={kind}
          visible
          onClose={() => setKind(null)}
        />
      )}
      <div className="flex gap-2">
        <button
          className="py-3 px-5 w-full text-sm font-medium text-center rounded-md text-white sm:w-auto bg-green-600"
          onClick={() => setKind(TransactionType.DEPOSIT)}
        >
          Deposit
        </button>
        <button
          className="py-3 px-5 w-full text-sm font-medium text-center rounded-md text-white sm:w-auto bg-red-600"
          onClick={() => setKind(TransactionType.WITHDRAWAL)}
        >
          Withdraw
        </button>
      </div>
    </>
  );
};

export default CreateTransactionButton;
