/**
 * Creates a new Member account.
 * You should only use this to bootstrap Swynca on a new database.
 */

import dotenv from "dotenv";
import { randomBytes } from "crypto";
import inquirer from "inquirer";
import { MemberStatuses } from "@prisma/client";
import { create } from "../src/lib/member";

dotenv.config();

(async () => {
  const { name, email } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Name:",
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
    email,
    status: MemberStatuses.ACTIVE,
    password,
  });

  console.log(`Created ${name} ${member}`);
  console.log("Password:", password);
})();
