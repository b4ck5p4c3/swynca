import { PrismaClient } from "@prisma/client";
import Auth0Provider from "next-auth/providers/auth0";
import { memberToProfile } from "../../auth/profile";
import { getRequiredEnv } from "@/lib/utils";

const prisma = new PrismaClient();

const Auth0ProviderFactory = () =>
  Auth0Provider({
    clientId: getRequiredEnv("AUTH0_CLIENT_ID"),
    clientSecret: getRequiredEnv("AUTH0_CLIENT_SECRET"),
    issuer: process.env.AUTH0_ISSUER_BASE_URL,
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

      return memberToProfile(memberBound.member);
    },
  });

export default Auth0ProviderFactory;
