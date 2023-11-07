import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "./auth";

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return <>{children}</>;
}
