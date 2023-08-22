import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import authorizedOnlyRequest from "@/lib/auth/telegram-bot-api";

type TransactionData = {
    id: string,
    datetime: string,
    comment: string,
    value: number,
};

async function getUserTransactions(request: Request) {
    const prisma = new PrismaClient();
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const limit = Number.parseInt(searchParams?.get("limit") || '100');
    const offset = Number.parseInt(searchParams?.get("offset") || '0');
    const query = `select 
    st.id, st.comment, st.amount as value, st.date as datetime 
from "SpaceTransaction" st
left join "Member" m on st."actorId" = m.id
left join "TelegramMetadata" tm on m.id = tm."memberId"
where m.id is not null limit $1 offset $2`;
    const transactions = await prisma.$queryRawUnsafe<TransactionData[]>(query, limit, offset);
    if (transactions === null) {
        return NextResponse.json({code: 404, message: 'Not found'});
    }
    return NextResponse.json(transactions);
}

export async function GET(request: Request) {
    return await authorizedOnlyRequest(request, getUserTransactions);
}