import {NextResponse} from "next/server";
import isAuthorized from "@/lib/api/auth";
import { PrismaClient } from '@prisma/client'

type DebtData = {
    username: string,
    debt: number
};

export async function GET(request: Request) {
    if (isAuthorized(request)) {
        const prisma = new PrismaClient();
        const limit = Number.parseInt(request.headers.get("limit") || '100');
        const offset = Number.parseInt(request.headers.get("offset") || '0');
        const query = `select * from (select (sum(st.amount) filter ( where st.type = 'DEPOSIT' ) - sum(st.amount) filter ( where st.type = 'WITHDRAWAL' )) as balance,
 tm."telegramId" from "SpaceTransaction" st
left join "Member" m on m.id = st."actorId" and m.id is not null
left join "TelegramMetadata" tm on tm."memberId" = m.id and m.id is not null
group by tm."telegramId"
  limit $1 offset $2) t where t.balance < 0`;
        const debtData = await prisma.$queryRawUnsafe<DebtData[]>(query, [limit, offset]);
        console.log(debtData);
        if (debtData === null) {
            return NextResponse.json({code: 404, message: 'Not found'});
        }
        return NextResponse.json(debtData);
    } else {
        return new Response(JSON.stringify({ code: 401, message: 'Unauthorized'}), { status: 401 });
    }
}