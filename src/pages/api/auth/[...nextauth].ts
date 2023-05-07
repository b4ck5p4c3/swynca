import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { session } from "../../../lib/auth/callbacks";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER_BASE_URL as string,
      profile: async (data) => {
        const memberBound = await prisma.externalAuthenticationAuth0.findFirst({
          where: {
            auth0Id: data.sub,
          },
          include: {
            member: true,
          },
        });

        if (!memberBound) {
          throw new Error(
            `Unbound Member tried to log in, reject for ${data.sub} (${data.name} ${data.email})`
          );
        }

        return {
          id: memberBound.memberId,
          email: memberBound.member.email,
          name: memberBound.member.name,
          image: data.picture, // @todo use local avatars later
        };
      },
    }),
  ],
  callbacks: {
    session,
  },
});
