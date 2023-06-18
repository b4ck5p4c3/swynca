import NextAuth from "next-auth";
import { session } from "lib/auth/callbacks";
import OryProviderFactory from "@/lib/integrations/ory/auth-provider";

export default NextAuth({
  debug: true,
  providers: [OryProviderFactory()],
  callbacks: {
    session,
  },
});
