import {NextRequest, NextResponse} from "next/server";
import { PrismaClient } from '@prisma/client'
import authorizedOnlyRequest from "@/lib/auth/telegram-bot-api";

type DebtData = {
    username: string,
    id: string,
    debt: number
};

async function getUsersWithNegativeBalance(request: NextRequest) {
    const prisma = new PrismaClient();
    const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") || '100');
    const offset = Number.parseInt(request.nextUrl.searchParams.get("offset") || '0');
    const query = `select * from (select (sum(st.amount) filter ( where st.type = 'DEPOSIT' ) - sum(st.amount) filter ( where st.type = 'WITHDRAWAL' )) as debt,
 tm."telegramId" as id, tm."telegramName" as username from "SpaceTransaction" st
left join "Member" m on m.id = st."actorId" and m.id is not null
left join "TelegramMetadata" tm on tm."memberId" = m.id and m.id is not null
group by tm."telegramId", tm."telegramName") t where t.debt < 0 limit $1 offset $2`;
    const debtData = await prisma.$queryRawUnsafe<DebtData[]>(query, limit, offset);
    console.log(debtData);
    return NextResponse.json(debtData);
}

export async function GET(request: Request) {
    return await authorizedOnlyRequest(request, getUsersWithNegativeBalance);
}