#!/usr/bin/env node

/**
 * Script to fill ExternalAuthenticationAuth0 using emails as
 * member's PK between local Members database and Auth0
 */

import { PrismaClient } from "@prisma/client";
import { ManagementClient } from "auth0";
import { config } from "dotenv";

config();

const prisma = new PrismaClient();
const auth0 = new ManagementClient({
  domain: process.env.AUTH0_MGMT_DOMAIN,
  clientId: process.env.AUTH0_MGMT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET,
});

const auth0Members = await auth0.getUsers({ per_page: 100 });
const dbMembers = await prisma.member.findMany();

const bounds = dbMembers
  .map((dm) => {
    const am = auth0Members.find(
      (am) => am.email.toLowerCase() === dm.email.toLowerCase()
    );
    if (!am) return null;
    return {
      create: {
        auth0Id: am.user_id,
        memberId: dm.id,
      },
      update: {
        memberId: dm.id,
      },
      where: {
        auth0Id: am.user_id,
      },
    };
  })
  .filter((b) => b !== null);

Promise.all(
  bounds.map((b) => prisma.externalAuthenticationAuth0.upsert(b))
).then((results) => console.log(results));
