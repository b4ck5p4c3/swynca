import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import authorizedOnlyRequest from "@/lib/auth/telegram-bot-api";

async function getUserTransactions(request: Request) {
    const prisma = new PrismaClient();
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const limit = Number.parseInt(searchParams?.get("limit") || '100');
    const offset = Number.parseInt(searchParams?.get("offset") || '0');
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
}

export async function GET(request: Request) {
    return await authorizedOnlyRequest(request, getUserTransactions);
}