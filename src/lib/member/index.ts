import { MemberStatuses, PrismaClient, } from "@prisma/client";
import { AccountManagement } from "../auth/provider";
import { isEmail, isName } from "../validation";

const prisma = new PrismaClient();

export type AccountCreateDTO = {
  name: string,
  email: string,
  status?: MemberStatuses
}

export function fetch(id: string) {
  return prisma.member.findFirst({
    where: {
      id,
    },
    include: {
      MembershipSubscriptionHistory: {
        include: {
          membership: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        where: {
          declinedAt: null,
        },
      },
      ACSKey: true,
    },
  });
}

/**
 * Checks is a particular Member exists by its internal ID
 * @param memberId Internal ID of the Member
 * @returns True if Member exists, false otherwise
 */
export async function isExistsById(memberId: string): Promise<boolean> {
  const res = await prisma.member.findFirst({ where: { id: memberId }, select: { id: true } });
  return res !== null;
}

/**
 * Creates a new Member, external account and binds them together
 * @param AccountCreateDTO Properties to create a new Member 
 * @returns Internal ID of the newly created Member
 */
export async function create({ name, email, status }: AccountCreateDTO): Promise<string> {
  const accountManagement = new AccountManagement();

  if (!isName(name)) {
    throw new Error('Incorrect name');
  }

  if (!isEmail(email)) {
    throw new Error('Incorrect email');
  }

  const member = await prisma.member.create({
    data: {
      name,
      email,
      status,
    }
  });

  const externalAccount = await accountManagement.createAccount({
    name,
    email,
    active: status ? status === "ACTIVE" : true,
  });

  await accountManagement.bind(member.id, externalAccount.id);
  return member.id;
}