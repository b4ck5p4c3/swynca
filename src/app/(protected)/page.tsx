import { getServerSession } from "@/lib/auth/wrapper";

export default async function DashboardPage() {
  const session = await getServerSession();

  return (
    <div>
      <h1>Look ma, rendered on server</h1>
      <p>
        Hi, {session?.user?.name} {session?.user?.email} {session?.user?.image}
      </p>
    </div>
  );
}
