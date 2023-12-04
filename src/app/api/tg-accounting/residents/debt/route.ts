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
    const query = `select ABS(amount) as debt, tm."telegramId" as id, tm."telegramName" as username from "Balance" b
left join "Member" m on m.id = b."entityId" and m.id is not null
left join "TelegramMetadata" tm on tm."memberId" = m.id and m.id is not null
where b.amount < 0 limit $1 offset $2`;
    const debtData = await prisma.$queryRawUnsafe<DebtData[]>(query, limit, offset);
    return NextResponse.json(debtData);
}

export async function GET(request: Request) {
    return await authorizedOnlyRequest(request, getUsersWithNegativeBalance);
}
