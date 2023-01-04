#!/usr/bin/env node

/**
 * Simple script for test data import from old accounting sheet
 * Import file should be CSV, without heading, formatted like:
 *
 * Member Name;Telegram_BUT_IT_IS_NOT_USED;Email
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";
import minimist from "minimist";

const prisma = new PrismaClient();

const args = minimist(process.argv.slice(2));
const csvPath = resolve(args._[0]);
const contents = readFileSync(csvPath, "utf-8")
  .split("\n")
  .filter((l) => l.length > 5)
  .map((l) => l.split(";").slice(0, 3));

const members = contents.map((c) => ({
  name: c[0],
  email: c[2],
}));

const ops = members.map(({name, email}) =>
  prisma.member.upsert({
    create: {
      name,
      email,
    },
    update: {
      name,
    },
    where: {
      email,
    },
  })
);

Promise.all(ops).then((results) => console.log(results));
