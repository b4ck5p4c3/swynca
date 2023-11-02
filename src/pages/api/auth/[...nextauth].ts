import NextAuth from "next-auth";
import { session } from "lib/auth/callbacks";
import LogtoProviderFactory from "@/lib/integrations/logto/auth-provider";

export default NextAuth({
  debug: true,
  providers: [LogtoProviderFactory()],
  callbacks: {
    session,
  },
});
