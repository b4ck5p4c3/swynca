import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { session } from "../../../lib/auth/callbacks";

export default NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER_BASE_URL as string,
      profile: (data) => ({
        id: data.sub,
        email: data.email,
        name: data.name,
        image: data.picture,
      }),
    }),
  ],
  callbacks: {
    session,
  },
});
