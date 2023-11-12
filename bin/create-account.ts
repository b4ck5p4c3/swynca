/**
 * Creates a new Member account.
 * You should only use this to bootstrap Swynca on a new database.
 */

import dotenv from "dotenv";
import { randomBytes } from "crypto";
import inquirer from "inquirer";
import { MemberStatuses } from "@prisma/client";
import { AccountManagement } from "../src/lib/auth/provider";
import { create } from "../src/lib/member";

dotenv.config();

(async () => {
  const api = new AccountManagement();
  const { name, username, email } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Name:",
      validate: (input) => input.length > 0,
    },
    {
      type: "input",
      name: "username",
      message: "Username:",
      validate: (input) => input.length > 0,
    },
    {
      type: "input",
      name: "email",
      message: "Email:",
      validate: (input) => input.length > 3,
    },
  ]);

  const password = (await randomBytes(8)).toString("hex");
  const member = await create({
    name,
    username,
    email,
    status: MemberStatuses.ACTIVE,
    password,
  });

  console.log(`Created ${name} (${username}) ${member}`);
  console.log("Password:", password);
})();
