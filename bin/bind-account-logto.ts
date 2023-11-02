/**
 * Binds LogTo SSO ID to existing member
 */

import inquirer from 'inquirer';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
  const { logtoId, email } = await inquirer.prompt([
    { type: 'input', name: 'logtoId', message: 'LogTo ID:', validate: (input) => input.length > 0 },
    { type: 'input', name: 'email', message: 'Member email:', validate: (input) => input.length > 3 },
  ]);

  const member = await prisma.member.findFirst({
    where: { email }
  });

  if (!member) {
    console.error(`Member with email ${email} not found`);
    process.exit(1);
  }

  await prisma.externalAuthenticationLogto.create({
    data: {
      logtoId,
      memberId: member.id
    }
  });

  console.log(`Successfully bound ${member.name} to LogTo ${logtoId} identity`);

})();