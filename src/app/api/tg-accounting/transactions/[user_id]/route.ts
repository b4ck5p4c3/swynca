import {NextResponse} from "next/server";
import isAuthorized from "@/lib/api/auth";
import {PrismaClient} from "@prisma/client";

export async function GET(request: Request) {
    if (isAuthorized(request)) {
        const prisma = new PrismaClient();
        const limit = Number.parseInt(request.headers.get("limit") || '100');
        const offset = Number.parseInt(request.headers.get("offset") || '0');
        const member = await prisma.telegramMetadata.findFirst({
            skip: offset,
            take: limit,
            select: {
                telegramId: true,
                Member: {
                    select: {
                        name: true,
                        SpaceTransaction: {
                            select: {
                                id: true,
                                date: true,
                                amount : true
                            }
                        }
                    }
                }
            }
        });
        console.log(member);
        if (member === null) {
            return NextResponse.json({code: 404, message: 'Not found'});
        }
        return NextResponse.json(member.Member.SpaceTransaction);
    } else {
        return new Response(JSON.stringify({ code: 401, message: 'Unauthorized'}), { status: 401 });
    }
}