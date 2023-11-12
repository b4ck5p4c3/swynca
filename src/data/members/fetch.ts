import * as lib from "@/lib/member";
import { MemberStatuses } from "@prisma/client";

export type GetAllMembersDTO = {
  id: string;
  name: string;
  username: string;
  status: MemberStatuses;
}[];

export async function getAll(): Promise<GetAllMembersDTO> {
  const members = await lib.getAll();
  return members.map((m) => ({
    id: m.id,
    name: m.name,
    username: m.username,
    status: m.status,
  }));
}
