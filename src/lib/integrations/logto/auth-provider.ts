import { OIDCConfig } from "next-auth/providers";
import { memberToProfile } from "@/lib/auth/profile";
import { getRequiredEnv } from "@/lib/utils/env";
import prisma from "@/lib/db";

type LogtoProfile = {
  sub: string;
  name: string | null;
  picture: string | null;
  username: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  aud: string;
  exp: number;
  iat: number;
  iss: string;
};

const LogtoProviderFactory = (): OIDCConfig<LogtoProfile> => {
  return {
    type: "oidc",
    id: "logto",
    name: "Logto",
    issuer: getRequiredEnv("LOGTO_ISSUER"),
    clientId: getRequiredEnv("LOGTO_CLIENT_ID"),
    clientSecret: getRequiredEnv("LOGTO_CLIENT_SECRET"),
    client: {
      authorization_signed_response_alg: "ES384",
      id_token_signed_response_alg: "ES384",
    },
    authorization: { params: { grant_type: "authorization_code" } },
    profile: async (data) => {
      const memberBound = await prisma.externalAuthenticationLogto.findFirst({
        where: {
          logtoId: data.sub,
        },
        include: {
          member: true,
        },
      });

      if (!memberBound) {
        throw new Error(
          `Unbound Member tried to log in, reject for ${data.sub}`,
        );
      }

      return memberToProfile(memberBound.member, {
        image: data.picture || undefined,
      });
    },
  };
};

export default LogtoProviderFactory;
