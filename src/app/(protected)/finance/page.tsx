import MembersBalanceTable from "./_components/balance/member-table";
import BalanceOverview from "./_components/balance/overview";

export default async function FinancePage() {
  return (
    <>
      <main className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold font-mono">Finance</h1>
        </header>
        <BalanceOverview />
        <MembersBalanceTable />
      </main>
    </>
  );
}
