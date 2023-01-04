import { ReactNode } from "react";
import { unstable_getServerSession as getServerSession } from "next-auth";
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

  if (!session?.user) {
    // Workaround, as next's "redirect" doesn't work well in RFC for now
    return <AuthRedirect />;
  }

  return children;
}
