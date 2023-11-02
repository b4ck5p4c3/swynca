/**
 * Creates a new Member account.
 * You should only use this to bootstrap Swynca on a new database.
 */

import inquirer from 'inquirer';
import { MemberStatuses, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
  const { name, email } = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Name:', validate: (input) => input.length > 0 },
    { type: 'input', name: 'email', message: 'Email:', validate: (input) => input.length > 3 },
  ]);

  const member = await prisma.member.create({
    data: {
      name,
      email,
      status: MemberStatuses.ACTIVE,
    }
  });

  console.log(`Created Member ${member.id} (${member.name})`);

})();