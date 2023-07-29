import { getRequiredEnv } from "@/lib/utils";
import { KeyType, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

async function getKeys() {
  const keys = await prisma.aCSKey.findMany({
    orderBy: [{ updatedAt: "asc" }],
    select: {
      type: true,
      key: true,
      member: {
        select: {
          username: true,
        },
      },
    },
  });

  const uids = keys
    .filter(({ type }) => type === KeyType.UID)
    .map(({ key, member: { username } }) => ({ [key]: username }));
  const pans = keys
    .filter(({ type }) => type === KeyType.PAN)
    .map(({ key, member: { username } }) => ({ [key]: username }));

  const entities = {
    uids,
    pans,
  };

  return entities;
}

async function getLastModifyDate() {
  const date = await prisma.aCSKey.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      updatedAt: true,
    },
    take: 1,
  });
  return date?.[0]?.updatedAt?.toISOString?.() as string | undefined;
}

export async function GET(request: Request) {
  const token = request.headers.get("authorization");
  if (token === getRequiredEnv("ACS_TOKEN")) {
    const date = await getLastModifyDate();
    const etag = request.headers.get("Etag");
    if (date === etag) {
      return new Response(null, { status: 304 });
    }
    const { uids, pans } = await getKeys();
    return NextResponse.json({ uids, pans, date });
  } else {
    return new Response(null, { status: 401 });
  }
}
