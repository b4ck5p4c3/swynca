import { Member, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function fetch(id: string): Promise<Member | null> {
    return prisma.member.findFirst({
        where: {
            id
        }
    });
}