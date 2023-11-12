"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editMembership } from "@/data/memberships/action";
import Modal from "@/shared/Modal";
import { useForm } from "react-hook-form";
import useCurrencySymbol from "@/shared/hooks/useCurrencySymbol";
import Spinner from "@/shared/Spinner";
import { MembershipDTO } from "@/data/memberships/fetch";

export type FormValues = {
  title: string;
  amount: string;
  active: boolean;
};

export type CreateMembershipProps = {
  onClose: () => void;
  membership: MembershipDTO;
};

export type EditMembershipProps = {
  membership: MembershipDTO;
};

function EditMembershipModal({ membership, onClose }: CreateMembershipProps) {
  const { refresh } = useRouter();
  const currencySymbol = useCurrencySymbol();
  const [error, setError] = useState<string | undefined>(undefined);
  const {
    formState: { isSubmitting, isValid },
    register,
    handleSubmit,
  } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      active: membership.active,
      amount: membership.amount.toFixed(2),
      title: membership.title,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const response = await editMembership({ id: membership.id, ...data });
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
              Add membership
            </h2>
          </header>
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div
                className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <span className="font-medium">Heads up!</span> {error}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-600">Title</span>
                <input
                  type="text"
                  placeholder="Student"
                  className="w-full rounded border border-gray-200 p-3"
                  {...register("title", { required: true, minLength: 1 })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-600">Amount</span>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    className="w-full rounded border border-gray-200 p-3"
                    {...register("amount", { required: true, min: 0 })}
                  />
                  <span className="text-2xl">{currencySymbol}</span>
                </div>
              </div>
              <div>
                <div className="flex gap-2 items-center">
                  <input type="checkbox" {...register("active")} />
                  <span>Active</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 text-white text-base font-medium rounded-md w-full shadow-sm flex flex-col items-center disabled:bg-violet-400 disabled:cursor-not-allowed"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? <Spinner /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default function EditMembership({ membership }: EditMembershipProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen && (
        <EditMembershipModal
          membership={membership}
          onClose={() => setIsOpen(false)}
        />
      )}
      <button
        className="py-2 px-4 w-full text-sm rounded-md font-medium text-white sm:w-auto bg-violet-600"
        role="button"
        onClick={() => setIsOpen(true)}
      >
        Edit
      </button>
    </>
  );
}
