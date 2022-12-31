import { ReactNode } from "react";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AuthRedirect from "../lib/components/AuthRedirect/AuthRedirect";
import { session as sessionCallback } from "../lib/auth/callbacks";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await getServerSession({
    callbacks: {
      session: sessionCallback,
    },
  });
  console.log("sesh", session);

  if (!session?.user) {
    return <AuthRedirect />;
  }

  console.log("pass");

  return children;
}
