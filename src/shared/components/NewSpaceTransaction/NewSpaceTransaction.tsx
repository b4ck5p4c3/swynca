export type NewSpaceTransactionProps = {
  visible?: boolean;
  onComplete?: () => void;
  onDiscard?: () => void;
};

const NewSpaceTransaction: React.FC<NewSpaceTransactionProps> = ({
  visible,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative  top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white gap-4">
        <div className="mt-3 text-center flex flex-col gap-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-medium text-gray-900">+1,500 ₽</h2>
          <p className="text-gray-500 text-lg">Topped up the space balance</p>
          <div className="items-center">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSpaceTransaction;
