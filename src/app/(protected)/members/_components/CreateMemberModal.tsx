"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../../../_shared/Modal";
import { useFormState } from "react-dom";
import createMember from "@/data/members/action";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import Spinner from "@/app/_shared/Spinner";

export type FormValues = {
  email: string;
  name: string;
  username: string;
};

export type CreateMemberModalProps = {
  onClose?: () => void;
};

const CreateMemberModal: React.FC<CreateMemberModalProps> = ({ onClose }) => {
  const { push } = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);
  const {
    formState: { isSubmitting, isValid, errors },
    register,
    handleSubmit,
  } = useForm<FormValues>({ mode: "all" });

  const onSubmit = async (data: FormValues) => {
    const response = await createMember(data);
    if (response.success) {
      push(`/members/${response.id}?created=true`);
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
              Whoa, a new member!
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
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-600">Name</span>
                <input
                  type="text"
                  className={classNames(
                    "w-full rounded ring-1 ring-gray-200 p-3",
                    { "ring-red-500 text-red-600": !!errors.name }
                  )}
                  placeholder="Mary Doe"
                  autoFocus
                  {...register("name", {
                    pattern: /^[\p{L}\p{N}]+( [\p{L}\p{N}]+)*$/u,
                    required: true,
                  })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-600">Username</span>
                <input
                  type="text"
                  className={classNames(
                    "w-full rounded ring-1 ring-gray-200 p-3",
                    { "ring-red-500 text-red-600": !!errors.username }
                  )}
                  placeholder="mary_doe"
                  {...register("username", {
                    pattern: /^[a-zA-Z]+[a-zA-Z0-9_]*$/u,
                    required: true,
                  })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-600">Email</span>
                <input
                  type="email"
                  className={classNames(
                    "w-full rounded ring-1 ring-gray-200 p-3",
                    { "ring-red-500 text-red-600": !!errors.email }
                  )}
                  placeholder="m.doe@acme.corp"
                  formNoValidate
                  {...register("email", {
                    required: true,
                    pattern: /^\S+@\S+$/i,
                  })}
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

const CreateMemberModalButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="py-3 px-5 w-full text-sm font-medium text-center rounded-md text-white sm:w-auto bg-violet-600"
        role="button"
        onClick={() => setIsOpen(true)}
      >
        Create
      </button>
      {isOpen && <CreateMemberModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export { CreateMemberModal, CreateMemberModalButton };
