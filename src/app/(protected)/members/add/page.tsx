import React from "react"
import {v4 as uuidv4} from 'uuid';
import {MemberStatuses, PrismaClient} from "@prisma/client";
import OryAccountManagement from "@/lib/integrations/ory/account-management";

async function addItem(data: FormData) {
  'use server'
    const ident = new OryAccountManagement();
    try {
      const oryResult = await ident.createAccount({
        name:data.get('name') as string,
        email: data.get('email') as string,
        active: true
      });
      const prisma = new PrismaClient();
      const result = await prisma.member.create({
        data: {
          name: data.get('name') as string,
          email: data.get('email') as string,
          status: data.get('status') as MemberStatuses,
          id: uuidv4(),
        }
      });
      const relationRecord = await prisma.externalAuthenticationOry.create({
        data: {
          memberId: result.id,
          oryId: oryResult.id,
        }
      });
      console.log('addItem', result);
    } catch (e: any) {
      console.log('addItem createAccount error', e.response.data);
    }
}


function FormComponent() {
  return (
    <div>
      <form action={addItem}>
        <div>
          <label>Name</label>
          <input type="text" name="name"/>
        </div>
        <div>
          <label>Email</label>
          <input type="text" name="email"/>
        </div>
        <div>
          <label>State</label>
          <input type="text" name="status"/>
        </div>
        <button type="submit">Send message</button>
      </form>
    </div>
  );
}

export default async function MemberAddPage() {
  return <FormComponent/>
}
