// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { MemberStatuses, PrismaClient } from "@prisma/client";
import { AccountManagement } from '@/lib/auth/provider';

export default async function createMember(data: FormData) {
  'use server'
  const accountManagement = new AccountManagement();

  const prisma = new PrismaClient();
  const result = await prisma.member.create({
    data: {
      name: data.get('name') as string,
      email: data.get('email') as string,
      status: data.get('status') as MemberStatuses,
      id: uuidv4(),
    }
  });

  // create relation
}
