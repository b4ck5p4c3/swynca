#!/usr/bin/env node

/**
 * Imports members from Auth0 to Swynca using email as primary key
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

// Works only up to 100 members. Otherwise, you should implement
// correct pagination here
const auth0Members = await auth0.getUsers({ per_page: 100 });

const promises = auth0Members.map(async member => {
  const swyncaMember = await prisma.member.upsert({
    where: {
      email: member.email,
    }, 
    update: {
      name: member.name,
      status: member.blocked ? 'FROZEN' : 'ACTIVE'
    },
    create: {
      name: member.name,
      email: member.email,
      status: member.blocked ? 'FROZEN' : 'ACTIVE',      
    }
  });

  const externalAuth = await prisma.externalAuthenticationAuth0.upsert({
    where: {
      memberId: swyncaMember.id
    },
    update: {
      auth0Id: member.user_id
    },
    create: {
      memberId: swyncaMember.id,
      auth0Id: member.user_id
    }
  })

  return { member: swyncaMember, auth: externalAuth };
})

Promise.all(promises).then(members => members.forEach(m => console.log('Imported', m.member.email)))
