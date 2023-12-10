import MembersBalanceTable from "./_components/balance/member-table";
import BalanceOverview from "./_components/balance/overview";
import SpaceTransactionsTable from "./_components/space-transaction/table";

export type FinancePageProps = {
  searchParams: {
    page?: string;
  };
};

const FinancePage: React.FC<FinancePageProps> = ({ searchParams }) => {
  return (
    <>
      <main className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold font-mono">Finance</h1>
        </header>
        <BalanceOverview />
        <MembersBalanceTable />
        <SpaceTransactionsTable page={searchParams.page} />
      </main>
    </>
  );
};

export default FinancePage;
