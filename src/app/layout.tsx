import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import AuthRedirect from "shared/components/AuthRedirect/AuthRedirect";
import { session as sessionCallback } from "lib/auth/callbacks";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession({
    callbacks: {
      session: sessionCallback,
    },
  });

  if (!session?.user) {
    // Workaround, as next's "redirect" doesn't work well in RSC for now
    return <AuthRedirect />;
  }

  return <>{children}</>;
}
