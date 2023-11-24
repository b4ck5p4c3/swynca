import { MemberStatuses, PrismaClient } from "@prisma/client";
import { AccountManagement } from "../auth/provider";
import { isEmail, isName, isUsername } from "../validation";

const prisma = new PrismaClient();

export type AccountCreateDTO = {
  name: string;
  username: string;
  email: string;
  status?: MemberStatuses;
  password?: string;
};

/**
 * Returns all members
 * @returns Array of Member objects
 */
export async function getAll() {
  return prisma.member.findMany();
}

/**
 * Gets a Member by its internal ID
 * @param id Internal ID of the Member
 * @returns Member object
 */
export async function getById(id: string) {
  return prisma.member.findUnique({ where: { id } });
}

/**
 * Checks is a particular Member exists by its internal ID
 * @param memberId Internal ID of the Member
 * @returns True if Member exists, false otherwise
 */
export async function isExistsById(memberId: string): Promise<boolean> {
  const res = await prisma.member.findFirst({
    where: { id: memberId },
    select: { id: true },
  });
  return res !== null;
}

/**
 * Creates a new Member, external account and binds them together
 * @param AccountCreateDTO Properties to create a new Member
 * @returns Internal ID of the newly created Member
 */
export async function create({
  name,
  username,
  email,
  status,
  password,
}: AccountCreateDTO): Promise<string> {
  const accountManagement = new AccountManagement();

  if (!isName(name)) {
    throw new Error("Incorrect name");
  }

  if (!isEmail(email)) {
    throw new Error("Incorrect email");
  }

  if (!isUsername(username)) {
    throw new Error("Incorrect username");
  }

  const { member, externalAccount } = await prisma.$transaction(async (tx) => {
    const member = await tx.member.create({
      data: {
        name,
        username,
        email,
        status,
      },
    });

    const externalAccount = await accountManagement.createAccount({
      name,
      email,
      username,
      password,
      active: status ? status === "ACTIVE" : true,
    });

    return { member, externalAccount };
  });

  await accountManagement.bind(member.id, externalAccount.id);
  return member.id;
}

/**
 * Frozen a Member and disables its external account
 * @param id Internal ID of the Member
 */
export async function disable(id: string): Promise<void> {
  const accountManagement = new AccountManagement();
  const member = await prisma.member.update({
    where: { id },
    data: { status: MemberStatuses.FROZEN },
  });

  const externalId = await accountManagement.getExternalId(member.id);
  if (!externalId) {
    throw new Error(`Member ${member.id} does not have an external account`);
  }

  await accountManagement.disable(externalId);
}

/**
 * Unfrozen a Member and enables its external account
 * @param id Internal ID of the Member
 */
export async function enable(id: string): Promise<void> {
  const accountManagement = new AccountManagement();
  const member = await prisma.member.update({
    where: { id },
    data: { status: MemberStatuses.ACTIVE },
  });

  const externalId = await accountManagement.getExternalId(member.id);
  if (!externalId) {
    throw new Error(`Member ${member.id} does not have an external account`);
  }

  await accountManagement.enable(externalId);
}
