import {NextResponse} from "next/server";
import { PrismaClient } from '@prisma/client'
import authorizedOnlyRequest from "@/lib/auth/telegram-bot-api";

type DebtData = {
    username: string,
    debt: number
};

async function getUsersWithNegativeBalance(request: Request) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const prisma = new PrismaClient();
    const limit = Number.parseInt(searchParams?.get("limit") || '100');
    const offset = Number.parseInt(searchParams?.get("offset") || '0');
    const query = `select * from (select (sum(st.amount) filter ( where st.type = 'DEPOSIT' ) - sum(st.amount) filter ( where st.type = 'WITHDRAWAL' )) as balance,
 tm."telegramId" from "SpaceTransaction" st
left join "Member" m on m.id = st."actorId" and m.id is not null
left join "TelegramMetadata" tm on tm."memberId" = m.id and m.id is not null
group by tm."telegramId") t where t.balance < 0 limit $1 offset $2`;
    const debtData = await prisma.$queryRawUnsafe<DebtData[]>(query, limit, offset);
    console.log(debtData);
    if (debtData === null) {
        return NextResponse.json({code: 404, message: 'Not found'});
    }
    return NextResponse.json(debtData);
}

export async function GET(request: Request) {
    return await authorizedOnlyRequest(request, getUsersWithNegativeBalance);
}