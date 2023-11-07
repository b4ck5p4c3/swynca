import * as lib from "@/lib/member";
import { Member } from "@prisma/client";

export type GetAllMembersDTO = {
  id: Member['id'];
  name: Member['name'];
  username: Member['username'];
  status: Member['status'];
}[];

export async function getAll(): Promise<GetAllMembersDTO> {
  const members = await lib.getAll();
  return members.map(m => ({
    id: m.id,
    name: m.name,
    username: m.username,
    status: m.status,
  }));
}