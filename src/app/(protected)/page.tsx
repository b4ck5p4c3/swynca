import { getServerSession } from "next-auth";
import { session as sessionCallback } from "../../lib/auth/callbacks";

export default async function DashboardPage() {
  const session = await getServerSession({
    callbacks: {
      session: sessionCallback,
    },
  });

  return (
    <div>
      <h1>Look ma, rendered on server</h1>
      <p>Hi, {session?.user?.name} {session?.user?.email} {session?.user?.image}</p>
    </div>
  )
}
