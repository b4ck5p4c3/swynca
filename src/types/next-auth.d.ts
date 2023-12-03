import { DefaultSession } from "next-auth";

// Declaring custom session type
declare module "next-auth" {
  interface Session {
    user: {
      /**
       * Internal Member ID
       */
      id: string;

      /**
       * Information about the external authentication provider
       */
      external: {
        /**
         * Account ID from the external authentication provider
         */
        id: string;

        /**
         * Identifier of the external authentication provider
         */
        provider: string;
      };

      /**
       * Username (nickname)
       */
      username: string | null | undefined;
    } & DefaultSession["user"];
  }
}
