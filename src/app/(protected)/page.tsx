import { getSession } from "../auth";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div>
      <h1>Look ma, rendered on server</h1>
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
    </div>
  );
}
