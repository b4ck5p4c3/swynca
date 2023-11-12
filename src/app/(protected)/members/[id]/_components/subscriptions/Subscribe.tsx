"use client";

import Modal from "@/shared/Modal";
import { MembershipDTO } from "@/data/memberships/fetch";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { subscribe } from "@/data/subscriptions/action";
import { useRouter } from "next/navigation";
import Spinner from "@/shared/Spinner";
import { formatCurrency } from "@/lib/locale";

export type SubscribeProps = {
  memberId: string;
  availableMemberships: MembershipDTO[];
};

type FormValues = {
  membershipId: string;
};

const SubscribeModal: React.FC<SubscribeProps & { onClose: () => void }> = ({
  memberId,
  availableMemberships,
  onClose,
}) => {
  const { refresh } = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    formState: { isSubmitting, isValid },
    register,
    handleSubmit,
  } = useForm<FormValues>({ mode: "all" });

  const onSubmit = async ({ membershipId }: FormValues) => {
    const response = await subscribe({
      memberId,
      membershipId: membershipId,
    });

    if (response.success) {
      refresh();
      onClose();
    } else {
      setError(response.message);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="relative top-20 mx-auto p-5 border max-w-lg w-4/5 shadow-lg rounded-md bg-white gap-4">
        <div className="flex flex-col gap-4">
          <header>
            <h2 className="lg:text-2xl text-xl font-medium text-gray-900">
              Adding a new subscription
            </h2>
          </header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              {error && (
                <div
                  className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <span className="font-medium">Heads up!</span> {error}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-600">Membership</span>
              <select
                className="w-full rounded ring-1 ring-gray-200 p-3"
                {...register("membershipId", { required: true })}
              >
                {availableMemberships.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} – {formatCurrency(m.amount)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 text-white text-base font-medium rounded-md w-full shadow-sm flex flex-col items-center disabled:bg-violet-400 disabled:cursor-not-allowed"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? <Spinner /> : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

const Subscribe: React.FC<SubscribeProps> = ({
  availableMemberships,
  memberId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  if (availableMemberships.length === 0) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <SubscribeModal
          memberId={memberId}
          availableMemberships={availableMemberships}
          onClose={() => setIsOpen(false)}
        />
      )}
      <button
        className="py-3 px-5 w-full text-sm font-medium text-center rounded-md text-white sm:w-auto bg-violet-600"
        role="button"
        onClick={() => setIsOpen(true)}
      >
        Subscribe
      </button>
    </>
  );
};

export default Subscribe;
