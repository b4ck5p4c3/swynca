"use client";

import { unsubscribe } from "@/data/subscriptions/action";
import Spinner from "@/shared/Spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export type UnsubscribeProps = {
  subscriptionId: string;
};

const Unsubscribe: React.FC<UnsubscribeProps> = ({ subscriptionId }) => {
  const { refresh } = useRouter();
  const [loading, setLoading] = useState(false);

  const action = async () => {
    setLoading(true);
    const response = await unsubscribe({ subscriptionId });
    if (response.success) {
      toast.success("Unsubscribed successfully");
      refresh();
    } else {
      toast.error(`Error: ${response.message}`);
    }
    setLoading(false);
  };

  return (
    <button
      className="flex justify-center px-3 py-2 w-24 rounded-md bg-red-500 text-white font-medium text-xs cursor-pointer"
      onClick={action}
    >
      {loading ? <Spinner className="h-4 w-4" /> : "Unsubscribe"}
    </button>
  );
};

export default Unsubscribe;
