import { Member } from "@prisma/client";

export type Profile = {
  id: string;
  name: string;
  email: string;
  username: string;
  image?: string;
};

export type SSOProfile = {
  image?: string;
}

export function memberToProfile(member: Member, ssoProfile?: SSOProfile): Profile {
  const { id, email, name, username } = member;
  return {
    id,
    email,
    name,
    username,
    image: ssoProfile?.image,
  };
}
