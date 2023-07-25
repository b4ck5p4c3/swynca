"use server";

import { getServerSession } from "next-auth";

export default async function createTransaction() {
  const session = await getServerSession();
  if (!session) {
    return;
  }

  console.log("createTransaction");
}
