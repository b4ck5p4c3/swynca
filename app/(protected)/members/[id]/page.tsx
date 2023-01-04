import { NextPage } from "next";
import React from "react";

const MemberPage: NextPage<{ params: { id: string } }> = ({ params }) => {
  return <div>{params.id}</div>;
};

export default MemberPage;
