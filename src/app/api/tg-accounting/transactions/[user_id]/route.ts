import {NextRequest, NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import authorizedOnlyRequest from "@/lib/auth/telegram-bot-api";

type TransactionData = {
    id: string,
    datetime: string,
    comment: string,
    value: number,
};

async function getUserTransactions(request: NextRequest, params: {user_id : string}) {
    const prisma = new PrismaClient();
    const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") || '100');
    const offset = Number.parseInt(request.nextUrl.searchParams.get("offset") || '0');
    const query = `select 
    st.id, st.comment, st.amount as value, st.date as datetime 
from "SpaceTransaction" st
left join "Member" m on st."actorId" = m.id
left join "TelegramMetadata" tm on m.id = tm."memberId"
where m.id is not null and tm."telegramId" = $1 limit $2 offset $3`;
    const transactions = await prisma.$queryRawUnsafe<TransactionData[]>(query, params.user_id, limit, offset);
    return NextResponse.json(transactions);
}

export async function GET(request: Request, { params }: { params: { user_id: string } }) {
    return await authorizedOnlyRequest(request, getUserTransactions, params);
}