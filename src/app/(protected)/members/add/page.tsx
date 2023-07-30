'use client'

import React from "react"
import addItem from "./action";
import {useRouter} from "next/navigation";

export default function AddForm() {
  const { push } = useRouter();
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData();
    data.set('name', event.target.name.value);
    data.set('email', event.target.email.value);
    data.set('status', event.target.status.value);
    await addItem(data);
    push('/members');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
