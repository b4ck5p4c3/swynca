import { NextPage } from "next";
import React from "react";
import {PrismaClient} from "@prisma/client";
import OryAccountManagement from "@/lib/integrations/ory/account-management";

async function update(data: FormData) {
  'use server'
  const id = data.get('id') as string;
  const prisma = new PrismaClient();
  const member = await prisma.member.findUnique({where: {id}});
  const relationRecord = await prisma.externalAuthenticationOry.findUnique({where:{memberId: id}});
  const ident = new OryAccountManagement();
  if (!member || !relationRecord) {
    return;
  }
  try {
    await ident.setTraits(member.name, member.email).updateAccount(
      relationRecord.oryId,
      {email: member.email, name: member.name}
    );
  } catch (e: any) {
    console.log('update error', e.response.data);
    return;
  }
  await prisma.member.update({
    where: {id},
    data: {
      name: data.get('name') as string,
      email: data.get('email') as string,
    }
  });

}

// @ts-ignore
function FormComponent({id, name, email}) {
  return (
    <div>
      <div>{id}</div>
      <form action={update}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={name}/>
        </div>
        <div>
          <label>Email:</label>
          <input type="text" name="email" value={email}/>
        </div>
        <input type="hidden" name="id" value={id}/>
        <button type="submit">Send message</button>
      </form>
    </div>
  );
}
// @ts-ignore
export default async function MemberPage(input: {params: { id: string }}): Promise<JSX.Element> {
  const prisma = new PrismaClient();
  const id = input.params.id;
  const member = await prisma.member.findUnique({where: {id}});
  return <FormComponent id={id} name={member?.name} email={member?.email}/>;
};

