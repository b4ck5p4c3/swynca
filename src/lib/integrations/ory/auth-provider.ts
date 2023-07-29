import { Member, PrismaClient } from "@prisma/client";
import { OAuthConfig } from "next-auth/providers";
import { MemberProfile, memberToProfile } from "../../auth/profile";
import { getRequiredEnv } from "@/lib/utils/env";

const prisma = new PrismaClient();

// Rough generic type, need to be polished for particular Ory setup
export type OryProfile = {
  amr: string[];
  at_hash: string;
  aud: string[];
  auth_time: number;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  rat: number;
  sid: string;
  sub: string;
};

const OryProviderFactory = (): OAuthConfig<OryProfile> => {
  return {
    type: "oauth",
    name: "Ory",
    id: "ory",
    wellKnown: getRequiredEnv("ORY_OAUTH_WELL_KNOWN"),
    authorization: { params: { grant_type: "authorization_code" } },
    idToken: true,
    checks: ["pkce", "state"],
    clientId: getRequiredEnv("ORY_OAUTH_CLIENT_ID"),
    clientSecret: getRequiredEnv("ORY_OAUTH_CLIENT_SECRET"),
    profile: async (data) => {
      const memberBound = await prisma.externalAuthenticationOry.findFirst({
        where: {
          oryId: data.sub,
        },
        include: {
          member: true,
        },
      });

      if (!memberBound) {
        throw new Error(
          `Unbound Member tried to log in, reject for ${data.sub}`
        );
      }

      return memberToProfile(memberBound.member);
    },
  };
};

export default OryProviderFactory;
