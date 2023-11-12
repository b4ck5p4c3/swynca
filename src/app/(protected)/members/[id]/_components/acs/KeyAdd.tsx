"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/shared/Modal";
import { useForm } from "react-hook-form";
import Spinner from "@/shared/Spinner";
import { KeyType } from "@prisma/client";
import { create } from "@/data/acs/action";
import toast from "react-hot-toast";

export type FormValues = {
  name: string;
  type: KeyType;
  key: string;
};

export type CreateKeyModalProps = {
  memberId: string;
  onClose: () => void;
};

const CreateKeyModal: React.FC<CreateKeyModalProps> = ({
  onClose,
  memberId,
}) => {
  const { refresh } = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);
  const {
    formState: { isSubmitting, isValid },
    register,
    watch,
    handleSubmit,
  } = useForm<FormValues>({
    mode: "all",
    defaultValues: { type: KeyType.UID },
  });
  const keyType = watch("type");

  const onSubmit = async (data: FormValues) => {
    const response = await create({
      ...data,
      memberId,
    });

    if (response.success) {
      refresh();
      onClose();
      toast.success("Key created");
    } else {
      setError(response.message);
    }
  };

  const keyPlaceholder =
    keyType === KeyType.PAN
      ? "1111222233334444"
      : "4, 7 or 10 hex digits (e.g. 00DEAD00)";

  return (
    <Modal onClose={onClose}>
      <div className="relative top-20 mx-auto p-5 border max-w-lg w-4/5 shadow-lg rounded-md bg-white gap-4">
        <div className="flex flex-col gap-4">
          <header>
            <h2 className="lg:text-2xl text-xl font-medium text-gray-900">
              Adding a new key
            </h2>
          </header>
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400"
                role="alert"
              >
                <span className="font-medium">Heads up!</span> {error}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-600">Name</span>
                <input
                  type="text"
                  placeholder="e.g. Keyfob"
                  className="w-full rounded border border-gray-200 p-3"
                  {...register("name", { required: true, minLength: 1 })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-600">Type</span>
                <select
                  className="w-full rounded border border-gray-200 p-3"
                  {...register("type", { required: true })}
                >
                  {Object.values(KeyType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-600">Key</span>
                <input
                  type="text"
                  placeholder={keyPlaceholder}
                  className="w-full rounded border border-gray-200 p-3 font-mono"
                  {...register("key", { required: true })}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 text-white text-base font-medium rounded-md w-full shadow-sm flex flex-col items-center disabled:bg-violet-400 disabled:cursor-not-allowed"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? <Spinner /> : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

const KeyAdd: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen && (
        <CreateKeyModal memberId={memberId} onClose={() => setIsOpen(false)} />
      )}
      <button
        className="py-3 px-5 w-full text-sm font-medium text-center rounded-md text-white sm:w-auto bg-violet-600"
        role="button"
        onClick={() => setIsOpen(true)}
      >
        Create
      </button>
    </>
  );
};

export default KeyAdd;
