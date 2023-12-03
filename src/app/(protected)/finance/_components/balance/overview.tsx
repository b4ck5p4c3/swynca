import { fetchCurrentSpaceBalance } from "@/data/space-transaction/fetch";
import { formatCurrency } from "@/lib/locale";
import classNames from "classnames";

export type BalanceOverviewProps = {};

const BalanceOverview: React.FC<BalanceOverviewProps> = async ({}) => {
  const balance = await fetchCurrentSpaceBalance();
  return (
    <section className="relative overflow-x-auto shadow-lg sm:rounded-lg p-8 flex flex-col md:flex-row gap-8 md:gap-0 justify-between">
      <div className="flex flex-col gap-2">
        <h3 className="text-gray-600 font-semibold">Available</h3>
        <span className="text-5xl font-semibold">
          {formatCurrency(balance.amount, true)}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-gray-600 font-semibold">Required</h3>
        <span className="text-5xl font-semibold">
          {formatCurrency(balance.basicExpenses, true)}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-gray-600 font-semibold">Difference</h3>
        <span
          className={classNames("text-5xl font-semibold", {
            "text-red-500": balance.difference < 0,
            "text-green-500": balance.difference >= 0,
          })}
        >
          {formatCurrency(balance.difference, true)}
        </span>
      </div>
    </section>
  );
};

export default BalanceOverview;
