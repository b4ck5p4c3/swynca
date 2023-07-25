"use client";

import { useState } from "react";
import CreateTransactionModal from "./modal";

const CreateTransactionButton: React.FC = ({}) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      {visible && (
        <CreateTransactionModal visible onClose={() => setVisible(false)} />
      )}
      <button
        className="py-3 px-5 w-full text-sm font-medium text-center rounded-sm text-white sm:w-auto bg-violet-600"
        onClick={() => setVisible(true)}
      >
        Create
      </button>
    </>
  );
};

export default CreateTransactionButton;
