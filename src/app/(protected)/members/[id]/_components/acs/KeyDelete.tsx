"use client";

import { remove } from "@/data/acs/action";
import Spinner from "@/shared/Spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export type KeyDeleteProps = {
  id: string;
};

const KeyDelete: React.FC<KeyDeleteProps> = ({ id }) => {
  const { refresh } = useRouter();
  const [loading, setLoading] = useState(false);

  const action = async () => {
    setLoading(true);
    const response = await remove({ id });
    if (response.success) {
      toast.success("Key removed");
      refresh();
    } else {
      toast.error(`Error: ${response.message}`);
    }
    setLoading(false);
  };

  return (
    <button
      className="flex justify-center px-3 py-2 w-18 rounded-md bg-red-500 text-white font-medium text-xs cursor-pointer"
      onClick={action}
    >
      {loading ? <Spinner className="h-3 w-3" /> : "Delete"}
    </button>
  );
};

export default KeyDelete;
