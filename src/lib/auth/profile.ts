import { Member, MemberStatuses } from "@prisma/client";

export type MemberProfile = {
  id: string;
  name: string;
  email: string;
  status: MemberStatuses;
  joinedAt: Date;
};

export function memberToProfile(member: Member): MemberProfile {
  const { id, email, name, joinedAt, status } = member;
  return {
    id,
    email,
    name,
    joinedAt,
    status,
  };
}
