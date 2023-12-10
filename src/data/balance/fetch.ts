import prisma from "@/lib/db";

export type MemberBalanceDTO = {
    amount: number|undefined;
    amountAfterSubscriptionRenew: number|undefined;
}

export async function fetchBalance(memberId: string) : Promise<MemberBalanceDTO> {
    const query = `select amount,
        (b.amount - (select sum(m.amount) 
            from "Membership" m 
            left join "MembershipSubscription" ms 
            on ms."membershipId" = m.id 
               and ms."memberId" = m.id and m.id is not null 
               and m.active = true 
               and ms."declinedAt" is null)) 
        as "amountAfterSubscriptionRenew" 
        from "Balance" b
        left join "Member" m on m.id = b."entityId" and m.id is not null
        where m.id = $1`;
    const data = await prisma.$queryRawUnsafe<MemberBalanceDTO[]>(query, memberId);

    if (data.length > 0) {
        return data[0];
    }
    return {amount: undefined, amountAfterSubscriptionRenew: undefined};
}
